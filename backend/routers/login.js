const router = require('express').Router();
const passport = require("passport");
const { isAuth } = require('../Config/isAuth');
const User = require("../db/User.Schema")
router.get("/login/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: process.env.UI,
    failureRedirect: "/api/v1//failed"
}))
router.get("/success", isAuth, async (req, res) => {
    try {
        const user = req.user
        console.log({ user })
        const date = user.createdAt.split(" ")
        const createdAt = date[2] + "/" + date[1] + "/" + date[3] + " " + date[4]
        const userInfo = {
            name: user.name + " " + user.lname ? user.lname : "",
            email: user.email,
            pic: user.pic,
            id: user.userId, createdAt
        }
        return res.status(200).json(userInfo)
    } catch (err) {
        console.log({ err })
        return res.sendStatus(500)
    }
})
router.get("/failed", async (req, res) => {
    return res.sendStatus(500)
})
router.post("/logout", async (req, res, next) => {
    try {
        req.logOut((err) => {
            if (err) {
                next()
            }
            return res.status(200).send("ok")
        })
    } catch (err) {
        console.log({ err })
        return res.sendStatus(500)
    }
})
router.delete("/delete", isAuth, async (req, res, next) => {
    try {
        const user = req.user
        const userinfo = await User.findOneAndDelete({ email: user.email }).exec()
        if (userinfo) {
            return res.status(200).send("ok")
        }
    } catch (err) {
        console.log({ err })
        return res.sendStatus(500)
    }
})
module.exports = router