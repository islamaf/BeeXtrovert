const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    body: String
});

const userModels = mongoose.Model('userModels', UserSchema);
module.exports = userModels;