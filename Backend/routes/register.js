const express = require('express')
const registerRouter = express.Router()
const passwordHasher = require('../Middleware/passwordHasher.js')
const db = require('../Sequelize/models')

//FIXME: redo Quering

const registerQuery = process.env.QUERY_REGISTER
registerRouter.use(passwordHasher)

registerRouter.post('/register', (req, res) => {
    const userEmail = req.body.userEmail
    const userName = req.body.userName
    const userPassword = req.body.userPassword

    const user = db.User.create({
        email: userEmail,
        nickname: userName,
        password: userPassword
    })
    req.session.data.user = user
    res.status(200).json({message: 'User created successfully!'})
})

module.exports = registerRouter