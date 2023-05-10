const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: String,
    lname: String,
    email: String,
    pic: String,
    verify: Boolean,
    provider: String,
    password: String,
    userId: String,
    createdAt:String
});
module.exports = new mongoose.model("users", schema);