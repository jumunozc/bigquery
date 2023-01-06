const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
    Email: { type: String, required: true , unique: true},
    Names: { type: String,  required: true },
    Surnames: { type: String, required: true },
    Password: { type: String, default: '', required: false },
    Phone: { type: String, required: true },
    Role: { type: Number, default: 2, required: true }, //1:Admin 2:Usuario
})

const User = mongoose.model('user', UserSchema)

module.exports = User