const express = require('express')
const registerRouter = express.Router()
const bcrypt = require('bcrypt')
const db = require('../Sequelize/models')
const { body, validationResult } = require('express-validator')

registerRouter.post('/register', body('userEmail').isEmail().normalizeEmail(), body('userName').isAlphanumeric().isLength({ min:4, max: 16 }), body('userPassword').isLength({ min: 6, max: 22 }), async (req, res) => {
    const errs = validationResult(req)
    if(!errs.isEmpty())
        return res.status(400).json({ message: 'Invalid fields' })

    const userEmail = req.body.userEmail
    const userName = req.body.userName
    const userPassword = await hashPassword(req.body.userPassword)
    console.log(userEmail);

    try
    {
        const uuc = await db.User.findOne({ where: { email: userEmail } })
        console.log(uuc);
        if( uuc != null || uuc != undefined )
        {
            res.status(409).json({ message: 'User already registered' })
            return
        }

        const user = db.User.create({
            email: userEmail,
            nickname: userName,
            password: userPassword
        })

        res.status(200).json({message: 'User created successfully!'})
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Server error' })
    }
})
const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 8)
    return hashedPassword
}

module.exports = registerRouter