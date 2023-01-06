var express = require('express');
var router = express.Router();
require('dotenv').config();
var user = require('../Services/Users')

router.post('/getUser', async function (req, res) {

    await user.getUserData(req.body.Email)
        .then((data) => {
            return data
        }).then((result) => {
            return res.status(200).json({
                esExitoso: true,
                data: result.retrieved
            })
        })

})

router.get('/getnonAdmins', async function (req, res) {

    await user.getnotAdmins()
        .then((data) => {
            return data
        }).then((result) => {
            return res.status(200).json({
                esExitoso: true,
                data: result.retrieved
            })
        })

})

module.exports = router