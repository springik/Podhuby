const express = require('express')
const db = require('../Sequelize/models')
const commentsRouter = express.Router()


commentsRouter.get('/get-comments/:podcastId', async (req, res) => {
    const { podcastId } = req.params
    const { lastSeenString, limit, rootId } = req.body
    

    try
    {
        /*
        const comments = awat db.sequelize.query(`SELECT c1.*, array_agg(c2) as replies
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
        */
       let comments = []

        if(lastSeenString === "") {
            comments = await db.Comment.findAndCountAll({
                where: {
                  podcast_id: podcastId,
                  root_id: rootId
                },
                limit,
                order: [['createdAt', 'DESC']],
                include: [{
                  model: db.User,
                  as: 'author'
                }]
              })
        }
        else
        {
            const lastSeen = new Date(lastSeenString).getTime()
            comments = await db.Comment.findAndCountAll({
                where: {
                  podcast_id: podcastId,
                  created_at: {
                    [db.Sequelize.Op.lt]: lastSeen
                  },
                  root_id: rootId
                },
                limit,
                order: [['createdAt', 'DESC']],
                include: [{
                  model: db.User,
                  as: 'author'
                }]
              })
        }


          if(comments.length === 0)
          {
            res.status(403).json({ message: 'No comments found' })
            return
          }

          res.status(200).json(comments)
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json('Something went wrong!')
    }
    
})

commentsRouter.post('/submit/comment', async (req, res) => {

    if(req.session.data.user === undefined || req.session.data.user === null) {
        res.status(404).json({ message: 'Try loging in' })
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
      //const comm = await db.Comment.findByPk(commentId)
      const comm = await db.Comment.findOne({
        where: {
          id: commentId,
          author_id: req.session.data.user.id
        }
      })
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
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
})

commentsRouter.delete('/comment', async (req, res) => {
  if(req.session.data.user === undefined || req.session.data.user === null) {
    res.status(403).json({ message: 'Try logging in' })
    return
  }
  const { commentId } = req.body
  console.log(req.session.data.user);

  try {
    //const comment = await db.Comment.findByPk(commentId)
    const comment = await db.Comment.findOne({
      where: {
        id: commentId,
        author_id: req.session.data.user.id
      }
    })
    if(comment === undefined || comment === null) {
      res.status(404).json({ message: 'No comment found to delete' })
      return
    }

    await comment.destroy()
    res.status(200).json({ message: 'Comment deleted successfully' })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' })
  }
})

module.exports = commentsRouter