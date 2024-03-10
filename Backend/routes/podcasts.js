const express = require('express')
const podcastsRouter = express.Router()
const db = require('../Sequelize/models');
const axios = require('axios')

//FIXME: REDO quering

podcastsRouter.get('/all/:count?', (req, res) => {
    db.Podcast.findAll({
        attributes: ['id', 'title', 'description', 'youtube_link', 'spotify_link', 'third_link', 'image_path', [db.sequelize.fn('array_agg', db.sequelize.col('Genres.name')), 'genre_names'], [db.sequelize.fn('array_agg', db.sequelize.col('Tags.name')), 'tag_names']],
        include: [
          {
            model: db.Genre,
            attributes: [],
            through: { attributes: [] },
            required: true
          },
          {
            model: db.Tag,
            attributes: [],
            through: { attributes: [] },
            required: true
          }
        ],
        group: ['Podcast.id']
      })
    .then((result) => {
        if(result == null) {
            res.status(500)
            return
        }
        let podcasts = result.map((podcast) => {
            return {
                id: podcast.id,
                title: podcast.title,
                description: podcast.description,
                links: { youtube: podcast.youtube_link, spotify: podcast.spotify_link, third: podcast.third_link },
                image_path: podcast.image_path,
                genre_names: podcast.dataValues.genre_names,
                tag_names: podcast.dataValues.tag_names
            }
        })

        res.status(200).json(JSON.stringify(podcasts))
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    });
})
podcastsRouter.get('/by-genre/:genre([a-zA-Z0-9]+)/:tags?', (req, res) => {

})
podcastsRouter.get('/:podcastId(\\d+)', (req, res) => {
    
})
podcastsRouter.get('/:podcastTitle(^[a-zA-Z0-9]+$)', (req, res) => {

})

podcastsRouter.post('/', (req, res) => {
  const channelHandle = req.body.channelHandle
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${channelHandle}&key=${process.env.YOUTUBE_API_KEY}`

  axios.get(url)
  .then((result) => {
    res.status(200).json({ message: 'Successfully added podcast' })
    console.log(result);
    return
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
    return
  });
})

module.exports = podcastsRouter