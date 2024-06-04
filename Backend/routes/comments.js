const express = require('express')
const db = require('../Sequelize/models')
const commentsRouter = express.Router()
const auth = require('../Middleware/auth.js')


commentsRouter.get('/get-comments/:podcastId', async (req, res) => {
    const { podcastId } = req.params
    const { lastSeenString, limit } = req.query
    let { rootId } = req.query
    if(rootId === "")
      rootId = null

    try
    {
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
                  as: 'author',
                  where: {
                    banned: false
                  }
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
                  as: 'author',
                  where: {
                    banned: false
                  }
                }]
              })
        }


          if(comments.length === 0)
          {
            res.status(404).json({ message: 'No comments found' })
            return
          }
          console.log(comments);
          res.status(200).json(comments)
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json('Something went wrong!')
    }
    
})

commentsRouter.post('/submit/comment', auth, async (req, res) => {
    const { podcastId, rootId, content } = req.body
    try
    {
      const comm = await db.Comment.create({ root_id: rootId, podcast_id: podcastId, author_id: req.session.user.id, content: content })
      await comm.save()
      const comment = await db.Comment.findOne({
        where: {
          id: comm.id
        },
        include: [
          {
            model: db.User,
            as: 'author'
          }
        ]
      })
      res.status(200).json({ message: 'Successfully created comment', comment: comment })
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json('Something went wrong!')
    }    
})

commentsRouter.patch('/edit/comment', auth, async (req, res) => {
    const { commentId, content } = req.body

    try
    {
      //const comm = await db.Comment.findByPk(commentId)
      const comm = await db.Comment.findOne({
        where: {
          id: commentId,
          author_id: req.session.user.id
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

commentsRouter.delete('/comment', auth, async (req, res) => {
  const { commentId } = req.body
  console.log(req.session.user);

  try {
    let comment = undefined
    if(req.session.user.permision_level === 'admin') {
      comment = await db.Comment.findOne({
        where: {
          id: commentId
        }
      })

    }
    else {
      comment = await db.Comment.findOne({
        where: {
          id: commentId,
          author_id: req.session.user.id
        }
      })
    }

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
commentsRouter.post('/report/comment', auth, async (req, res) => {
  const { commentId,  reason } = req.body

  try
  {
    const report = await db.Comment_Report.create({
      reason: reason,
      reporter_id: req.session.user.id,
      comment_id: commentId
    })
    console.log(report);
    res.status(200).json({ message: 'Comment reported' })
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

module.exports = commentsRouter