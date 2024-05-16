const express = require('express')
const bcrypt = require('bcrypt')
const authRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')
const { body, validationResult } = require('express-validator')
const auth = require('../Middleware/auth.js')
authRouter.use(sessionPreparer)

authRouter.post('/login',body('userEmail').isEmail().normalizeEmail(), body('userPassword').isLength({ min: 6, max: 22 }) , (req, res) => {
    const errs = validationResult(req)
    if(!errs.isEmpty()) {
        return res.status(400).json({ message: 'Invalid fields' })
    }

    if(req.session.user != undefined || req.session.user != null) {
        res.status(200).json({ message: "Already logged in" })
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

        req.session.user = result
        res.status(200).json({ user: result, message: "Successfully logged in" })
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", code: err.code })
    });
})
authRouter.post('/register', body('userEmail').isEmail().normalizeEmail(), body('userName').isAlphanumeric().isLength({ min:4, max: 16 }), body('userPassword').isLength({ min: 6, max: 22 }), async (req, res) => {
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
authRouter.post('/logout', auth, async (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Something went wrong' })
        }
        return res.setHeader('Set-Cookie',
        [
            'connect.sid=; Path=/; HttpOnly; Max-Age=0',
            'connect.sid=; Path=/; HttpOnly; Expires= Thu, 01 Jan 1970 00:00:00 GMT',
        ]
        ).status(200).json({ message: 'Successfully logged out' })
    })
})

authRouter.get('/current-user', auth, async (req, res) => {
    db.User.findOne({ where: { email: req.session.user.email } })
    .then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Fetch failed' })
        return
    });
})
module.exports = authRouter