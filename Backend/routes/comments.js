const express = require('express')
const db = require('../Sequelize/models')
const commentsRouter = express.Router()


commentsRouter.get('/get-comments/:podcastId', async (req, res) => {
    const podcastId = req.params.podcastId
    try
    {
        const comments = await db.sequelize.query(`SELECT c1.*, array_agg(c2) as replies
        FROM "Comments" c1
        LEFT JOIN "Comments" c2 ON c1.id = c2.root_id
        GROUP BY c1.id
        HAVING c1.root_id IS NULL AND c1.podcast_id = ${podcastId}
        ORDER BY c1.id;`)

        console.log(comments);
        const response = comments.map((entry) => {
            return entry[0]
        })

        res.status(200).json(response)
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json('Something went wrong!')
    }
    
})

commentsRouter.post('/submit/comment', async (req, res) => {

    if(req.session.data.user === undefined || req.session.data.user === null) {
        res.status(403).json({ message: 'Try loging in' })
        return
    }
    const { podcastId, rootId, content } = req.body

    try
    {
        const comm = await db.Comment.create({ root_id: rootId, podcast_id: podcastId, author_id: req.session.data.user.id, content: content })
        res.status(200).json({ message: 'Successfully created comment' })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json('Something went wrong!')
    }    
})

commentsRouter.patch('/edit/comment', async (req, res) => {
    const { commentId, content } = req.body

    if(req.session.data.user === undefined || req.session.data.user === null)
    {
        res.status(403).json({ message: 'Try logging in' })
        return
    }

    try
    {
        const comm = await db.Comment.findByPk(commentId)
        if(comm === undefined || comm === null) {
            res.status(404).json({ message: 'Comment not found' })
            return
        }

        comm.set({ content: content })
        await comm.save()

        res.status(200).json({ message: 'Successfully edited comment' })
    }
    catch (err)
    {
        
    }
})

module.exports = commentsRouter