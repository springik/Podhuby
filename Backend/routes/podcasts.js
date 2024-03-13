const express = require('express')
const podcastsRouter = express.Router()
const db = require('../Sequelize/models');
const axios = require('axios')
const {Op, where, QueryTypes} = require('sequelize')

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

podcastsRouter.post('/', async (req, res) => {
  const channelHandle = req.body.channelHandle
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${channelHandle}&key=${process.env.YOUTUBE_API_KEY}`
  const userGenres = req.body.genres
  let podcastData

  try {
    const result = await axios.get(url)
    podcastData = result.data.items.map((podcast) => {
      return {
        title: podcast.snippet.title,
        description: podcast.snippet.description,
        pfp_path: podcast.snippet.thumbnails.default.url,
        youtube_link: "https://youtube.com/" + podcast.snippet.customUrl
      }
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ message: "Server error" })
    return
  }

  /*
  axios.get(url)
  .then((result) => {
    podcastData = result.data.items.map((podcast) => {
      return {
        title: podcast.snippet.title,
        description: podcast.snippet.description,
        pfp_path: podcast.snippet.thumbnails.default.url,
        youtube_link: "https://youtube.com/" + podcast.snippet.customUrl
      }
    })
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
    return
  });
  */

  const genres = await getGenresFromDB(userGenres)
  if(genres == null) {
    res.status(500).json({ message: "Server error" })
    return
  }


  let toBeInserted = []
  userGenres.forEach((element) => {
    if(!genres.some((item) => item.dataValues.name === element)) {
      toBeInserted.push(element)
    }
  })
  const insertGenrePromise = new Promise((resolve, reject) => {
    toBeInserted.forEach((item) => {
      db.Genre.create({
        name: item
      })
      .then((result) => {
        genres.push(result)
      })
      .catch((err) => {
        console.log(err);
        reject()
        res.status(500).json({ message: "Server error" })
      });
    })
    resolve()
  })

  insertGenrePromise
  .then(async () => {
    let podcast
    try {
      podcast = await db.Podcast.create({
        title: podcastData[0].title,
        description: podcastData[0].description,
        image_path: podcastData[0].pfp_path,
        youtube_link: podcastData[0].youtube_link
      })
    }
    catch(err) {
      console.log(err);
      res.status(500).json({ message: "Server error" })
      return
    }

    console.log("Created podcast", podcast);

    const joinTablePromise = genres.map(async (genre) => {
      console.log("Current genre", genre);

      //FIXME: For some reason both ids are null, when sequelize inserts them as parameters into the query
      /*
      const podcast_genre = await db.Podcast_Genres.create({
        podcast_id: podcast.dataValues.id,
        genre_id: genre.dataValues.id
      })
      */

      await db.sequelize.query('insert into "Podcast_Genres" values($podcast, $genre)', { bind: { podcast: podcast.dataValues.id, genre: genre.dataValues.id }, type: QueryTypes.INSERT})

      //console.log("Created Podcast_genre", podcast_genre);
    })
    await Promise.all(joinTablePromise)
    res.status(200).json({ message: "Podcast created successfully" })
    return
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Server error" })
    return
  });

  })

const getGenresFromDB = async function(genresToSearch) {

  const results = await db.Genre.findAll({
    attributes: ["id", "name"],
    where: {
      name: {
        [Op.in]: genresToSearch
      }
    }
  })

  return results
}
module.exports = podcastsRouter