const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: String,
    hash: String
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;