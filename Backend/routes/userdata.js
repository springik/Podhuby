const express = require('express')
const userDataRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')
const auth = require('../Middleware/auth.js')

userDataRouter.use(sessionPreparer)

userDataRouter.get('/current-user', auth, async (req, res) => {
    db.User.findOne({ where: { email: req.session.user.email } })
    .then((result) => {
        console.log(result);
        return res.status(200).json(result)
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: 'Fetch failed' })
    });
})

module.exports = userDataRouter