const express = require('express')
const bcrypt = require('bcrypt')
const loginRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')
const { body, validationResult } = require('express-validator')
loginRouter.use(sessionPreparer)

loginRouter.post('/login',body('userEmail').isEmail().normalizeEmail(), body('userPassword').isLength({ min: 6, max: 22 }) , (req, res) => {
    const errs = validationResult(req)
    if(!errs.isEmpty()) {
        return res.status(400).json({ message: 'Invalid fields' })
    }

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
        if(result.banned) {
            res.status(403).json({ message: 'User has been banned' })
            return
        }
        if(!bcrypt.compare(req.body.userPassword, result.password)) {
            res.status(500).json({message: "User authentication failed"})
            return
        }

        req.session.data.user = result
        res.status(200).json({ user: result, message: "Successfully logged in" })
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", code: err.code })
    });
})

loginRouter.get('/current-user', async (req, res) => {
    if(req.session.data.user == undefined || req.session.data.user == null) {
        res.status(403).json({ message: 'User not logged in' })
        return
    }
    
    
    db.User.findOne({ where: { email: req.session.data.user.email } })
    .then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Fetch failed' })
        return
    });
})
module.exports = loginRouter