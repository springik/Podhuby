const express = require('express')
const userDataRouter = express.Router()
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const db = require('../Sequelize/models')

userDataRouter.use(sessionPreparer)

userDataRouter.get('/current-user', async (req, res) => {
    if(req.session.data.user == undefined || req.session.data.user == null)
        res.status(403).json({ message: 'User not logged in' })
    
    
    db.User.findOne({ where: { email: req.session.data.user.email } })
    .then((result) => {

        const returned = result.map((item) => {
            return {
                id: item.id,
                email: item.email,
                nickname: item.nickname,
                pfp_path: item.pfp_path
            }
        })

        res.status(200).json(returned)
        return
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Fetch failed' })
        return
    });
})

module.exports = userDataRouter