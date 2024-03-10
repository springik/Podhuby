const express = require('express')
const bcrypt = require('bcrypt')
const loginRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')

loginRouter.use(sessionPreparer)

//FIXME: redo quering

loginRouter.post('/login', (req, res) => {
    if(req.session.data.user != undefined || req.session.data.user != null) {
        res.status(200).json({ message: "Successfully logged in" })
        return
    }

    db.User.findOne({where: { email: req.body.userEmail }})
    .then((result) => {
        if(result == null || result == undefined) {
            res.status(500).json({ message: "User not found" })
            return
        }
        if(!bcrypt.compare(req.body.userPassword, result.password)) {
            res.status(500).json({message: "User authentication failed"})
            return
        }

        req.session.data.user = result
        res.status(200).json({ message: "Successfully logged in" })
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", code: err.code })
    });
})
module.exports = loginRouter