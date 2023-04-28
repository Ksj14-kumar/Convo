const express = require('express');
require("dotenv").config()
const app = express()
const fs = require("fs")
const utl = require("util")
const port = process.env.PORT || 6600
const server = require("http").createServer(app)
const session = require("express-session")
const cors = require("cors")
const MongoStore = require('connect-mongo');
require("./Config/db.connection")
const loginRouter = require("./routers/login")
const cookieParser= require("cookie-parser");
const passport = require('passport');
app.use(cors({
    origin: process.env.UI,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.static("view"))
app.use(session({
    name: "convo",
    secret: process.env.SessionSecret,
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({
        mongoUrl: process.env.URI,
        dbName: "session",
        crypto: {
            secret: process.env.SessionSecret
        }
    }),
    cookie: {
        httpOnly: true
    }
}))
// app.get("/*", (req, res) => {
//     return res.sendFile(__dirname, "view/index.html")
// })
app.use(passport.initialize())
app.use(passport.session())
require("./passport-strategy/passport")()
require("./Socket/socker.server")(server)
app.use("/api/v1", loginRouter)
console.log = function (d) {
    fs.createWriteStream(__dirname + "/log.log", { flags: "a" }).write(utl.format(d) + "\n")
    process.stdout.write(utl.format(d) + "\n")
}
server.listen(port, (err) => {
    if (err) {
        console.log(`server is not runing ${port}`)
    }
    else {
        console.log(`server is running at port ${port}`)
    }
})