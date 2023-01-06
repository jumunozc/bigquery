require('dotenv').config();
const UserModel = require('../Models/UserModel')

async function getUserData(id) {
    try {
        let retrieved = await UserModel.findOne({ Email: id })
        return { retrieved }
    } catch (error) {
        return { error }
    }

}

async function getnotAdmins() {
    try {
        let retrieved = await UserModel.find({ Role: 2 })
        return { retrieved }
    } catch (error) {
        return { error }
    }

}

module.exports = {
    getUserData,
    getnotAdmins
}