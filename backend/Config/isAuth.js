module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        console.log("not auth");
        return res.status(401).send("unauthorized");
    }
};