const express = require('express')
const adminActionsRouter = express.Router()
const db = require('../Sequelize/models')
const sessionPreparer = require('../Middleware/sessionPreparer.js')
const { where } = require('sequelize')

adminActionsRouter.use(sessionPreparer)

adminActionsRouter.put('/ban/:userId', async (req, res) => {
    const { userId } = req.params

    try
    {
        await db.User.update(
        {
            banned: true
        },
        {
            where:
            {
                id: userId
            }
        })
        res.status(200).json({ message: 'User banned successfully' })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong!' })
    }
    
})
adminActionsRouter.put('/unban/:userId', async (req, res) => {
    const { userId } = req.params

    try
    {
        await db.User.update(
        {
            banned: false
        },
        {
            where:
            {
                id: userId
            }
        })
        res.status(200).json({ message: 'User unbanned successfully' })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong!' })
    }
    
})
adminActionsRouter.get('/get-reports', async (req, res) => {
    const { lastSeenString, limit } = req.query
    try
    {
        let reports = []
        if(lastSeenString === "") {
            reports = await db.Comment_Report.findAll({
                limit,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: db.Comment,
                    as: 'comment',
                    include: [{
                        model: db.User,
                        as: 'author'
                    }]
                }] })
        }
        else
        {
            const lastSeen = new Date(lastSeenString).getTime()

            reports = await db.Comment_Report.findAll({
                where: {
                    created_at: {
                        [db.Sequelize.Op.lt]: lastSeen
                    }
                },
                limit,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: db.Comment,
                    as: 'comment',
                    include: [{
                        model: db.User,
                        as: 'author'
                    }]
                }] })
        }

        if(reports.length === 0)
            return res.status(404).json({ message: 'No reports found' })

        console.log(reports);
        res.status(200).json(reports)
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
})


module.exports = adminActionsRouter