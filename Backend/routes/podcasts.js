const express = require('express')
const podcastsRouter = express.Router()
const db = require('../Sequelize/models');
const axios = require('axios')
const {Op, QueryTypes, where} = require('sequelize')
const sessionPreparer = require('../Middleware/sessionPreparer.js');
const auth = require('../Middleware/auth.js')

podcastsRouter.use(sessionPreparer)

podcastsRouter.get('/all/:count?', async (req, res) => {
  try
  {
    const podcasts = await db.Podcast.findAll({
      attributes: [
        '*',
        [db.sequelize.fn('array_agg', db.sequelize.col('Genres.name')), 'genres'],
        [db.sequelize.fn('avg', db.sequelize.col('Podcast_Ratings.score')), 'average_rating'],
        [db.sequelize.cast(db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('Users.id'))), 'integer'), 'favourite_count']
      ],
      include: [
        {
          model: db.Genre,
          attributes: [],
          through: { attributes: [] },
          required: true,
          duplicating: false
        },
        {
          model: db.Podcast_Rating,
          attributes: [],
          required: false,
          duplicating: false
        },
        {
          model: db.User,
          attributes: [],
          through: { attributes: [ ] },
          required: false,
          duplicating: false
        }
      ],
      group: [ db.sequelize.col('Podcast.id') ],
      raw: true
    })

    if(podcasts.length == 0) 
      return res.status(404).json({ message: 'No podcasts found' })
    
    console.log(podcasts);
    res.status(200).json(podcasts)
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' })
  }
})
podcastsRouter.get('/:podcastTitle', async (req, res) => {
  const { podcastTitle } = req.params

  try
  {
    const podcasts = await db.Podcast.findAll({
      attributes: [
        '*',
        [db.sequelize.fn('array_agg', db.sequelize.col('Genres.name')), 'genres'],
        [db.sequelize.fn('avg', db.sequelize.col('Podcast_Ratings.score')), 'average_rating'],
        [db.sequelize.cast(db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('Users.id'))), 'integer'), 'favourite_count']
      ],
      where: {
        title: podcastTitle
      },
      include: [
        {
          model: db.Genre,
          attributes: [],
          through: { attributes: [] },
          required: true,
          duplicating: false
        },
        {
          model: db.Podcast_Rating,
          attributes: [],
          required: false,
          duplicating: false
        },
        {
          model: db.User,
          attributes: [],
          through: { attributes: [ ] },
          required: false,
          duplicating: false
        }
      ],
      group: [ db.sequelize.col('Podcast.id') ],
      raw: true
    })

    if(podcasts.length == 0) 
      return res.status(404).json({ message: 'No podcasts found' })
    
    console.log(podcasts);
    res.status(200).json(podcasts)
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' })
  }
})
podcastsRouter.post('/favourite/:podcastId', auth, async (req, res) => {
  const { podcastId } = req.params
  try {
    console.log(req.session.data.user);
    const [user_favourite_podcast, created] = await db.User_favourite_Podcast.findOrCreate({
      where: {
        podcast_id: podcastId,
        user_id: req.session.data.user.id
      }
    })

    if(created) {
      res.status(200).json({ message: 'Podcast favourited' })
      return
    }

    await user_favourite_podcast.destroy()
    res.status(200).json({ message: 'Successfully unfavourited podcast' })
    return
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
    return
  }
})
podcastsRouter.post('/rate/:podcastId', auth, async (req, res) => {
  const { podcastId } = req.params
  const { score } = req.body

  try
  {
    const rating = await db.Podcast_Rating.findOne({
      where: {
        user_id: req.session.data.user.id,
        podcast_id: podcastId
      }
    })
    if(rating === null) {
      await db.Podcast_Rating.create({
        podcast_id: podcastId,
        user_id: req.session.data.user.id,
        score: score
      })
      return res.status(200).json({ message: 'Rating created' })
    }
    else if(rating.score == score){
      await rating.destroy()
      return res.status(200).json({ message: 'Rating deleted' })
    }
    await rating.update({
      score: score
    })
    return res.status(200).json({ message: 'Rating changed' })
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

podcastsRouter.post('/youtube/submit', async (req, res) => {
  const channelHandle = req.body.channelHandle
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${channelHandle}&key=${process.env.YOUTUBE_API_KEY}`
  const userGenres = req.body.genres.map((g) => g.toLowerCase())

  try {
    const dataFromYtb = await axios.get(url)
    const podcastData = {
      title: dataFromYtb.data.items[0].snippet.title,
      description: dataFromYtb.data.items[0].snippet.description,
      youtube_link: "https://youtube.com/" + dataFromYtb.data.items[0].snippet.customUrl,
      spotify_link: null,
      third_link: null,
      image_path: dataFromYtb.data.items[0].snippet.thumbnails.default.url
    }
    // Create a transaction
    const transaction = await db.sequelize.transaction();
    try {
      // Create the podcast
      const podcast = await db.Podcast.create(podcastData, { transaction });
      // Create or find genres and associate with podcast
      const genrePromises = userGenres.map(async (genreName) => {
        const [genre, created] = await db.Genre.findOrCreate({
          where: { name: genreName },
          defaults: { name: genreName },
          transaction
        });
        return genre.id
      });
      const genreIds = await Promise.all(genrePromises)
      //console.log(genreIds);
      await podcast.save()
      await podcast.setGenres(genreIds, { transaction })
      // Commit the transaction
      await transaction.commit();
      res.status(201).json(podcast);
    } catch (error) {
      // Rollback the transaction
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: 'Error creating podcast' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating podcast' });
  }

  /*
  try
  {
    const dataFromYtb = await axios.get(url)
    const podcastData = {
      title: dataFromYtb.data.items[0].snippet.title,
      description: dataFromYtb.data.items[0].snippet.description,
      youtube_link: "https://youtube.com/" + dataFromYtb.data.items[0].snippet.customUrl,
      spotify_link: null,
      third_link: null,
      image_path: dataFromYtb.data.items[0].snippet.thumbnails.default.url
    }

    // Unique check just in case :p
    const p = await db.Podcast.findOne({
      where:
      {
        title: podcastData.title
      }
    })
    if(p){
      res.status(409).json({ message: 'Podcast already exists' })
      return
    }
    const podcast = await db.Podcast.create(podcastData)
    
    const genrePromises = userGenres.map(async (genreName) => {
      const [genre, created] = await db.Genre.findOrCreate({
        where: { name: genreName },
        defaults: { name: genreName },
      });
      await podcast.addGenre(genre);
    });

    await Promise.all(genrePromises)

    res.status(200).json(podcast)
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
  }
  */


  })
podcastsRouter.post('/spotify/submit', async (req, res) => {
  const token = await getSpotifyToken()
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
const getSpotifyToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', { 'grant-type': 'client-credentials' }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic ' + `${process.env.SPOTIFY_CLIENT_ID}` + ':' + `${process.env.SPOTIFY_CLIENT_SECRET}` } })
    console.log(response);
    return response
  }
  catch(err)
  {
    console.log(err);
    throw err
  }
}
const bulkFindOrCreateGenres = async (model, data) => {
  const records = await Promise.all(data.map(async (dataEntry) => {
    const [genre, created] = await model.findOrCreate({
      where: { name: dataEntry }
    });
    if (created) {
      await genre.save();
    }
    return genre;
  }));
  return records;
}

const getUniqueItems =(a, b) => {
  return a.filter(element => !b.includes(element))
}
module.exports = podcastsRouter