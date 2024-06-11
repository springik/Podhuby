const express = require('express')
const userDataRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')
const auth = require('../Middleware/auth.js')
const { hashPassword } = require('../utilities/utils.js')
const { body, validationResult } = require('express-validator')
const multer = require('multer')
const path = require('path')

userDataRouter.use(sessionPreparer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/Images/pfps/'))
    },
    filename: (req, file, cb) => {
        const ts = Date.now()        
        if(file.mimetype == 'image/png')
            cb(null, `${file.originalname}-${ts}.png`)
        else if(file.mimetype == 'image/jpeg')
            cb(null, `${file.originalname}-${ts}.jpg`)
        else
            console.log('oh fuck');
    }
})
const upload = multer({ storage })

userDataRouter.put('/credentials', auth,body('userEmail').isEmail().normalizeEmail(), body('userPassword').isLength({ min: 6, max: 22 }), body('userName').isAlphanumeric().isLength({ min: 1, max: 64 }), async (req, res) => {
    const { userEmail, userName, userPassword } = req.body

    const errs = validationResult(req)
    if(!errs.isEmpty())
        return res.status(400).json({ message: 'Invalid Fields' })

    const updated = {}
    if(userEmail)
        updated.email = userEmail
    if(userName)
        updated.nickname = userName
    if(userPassword)
        updated.password = hashPassword(userPassword)

    try
    {
        const user = await db.User.findByPk(req.session.user.id)
        if(!user)
            return res.status(404).json({ message: 'User Not Found' })
        
        await user.update(updated)
        await user.save()

        res.status(200).json({ user, message: 'Credentials updated' })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
})
userDataRouter.put('/pfp', auth, upload.single('pfp'), async (req, res) => {

    const imagePath = `/Images/pfps/${req.file.filename}`

    try
    {
        const user = await db.User.findByPk(req.session.user.id)
        if(!user)
            return res.status(404).json({ message: 'User not found' })

        await user.update({
            pfp_path: imagePath
        })

        await user.save()

        res.status(200).json({ message: 'test' })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
})

module.exports = userDataRouter