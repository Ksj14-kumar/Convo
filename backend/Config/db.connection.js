const mongoose = require("mongoose");
const URL = process.env.URI || "mongodb://127.0.0.1:27017:/api"
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("db is connected")
    })
    .catch((err) => {
        console.log("not connected")
    })