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
        [db.sequelize.fn('array_agg', db.sequelize.fn('distinct', db.sequelize.col('Genres.name'))), 'genres'],
        [db.sequelize.cast(db.sequelize.fn('avg', db.sequelize.col('Podcast_Ratings.score')), 'decimal(10,2)'), 'average_rating'],
        [db.sequelize.cast(db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('Users.id'))), 'integer'), 'favourite_count']
      ],
      include: [
        {
          model: db.User,
          attributes: [],
          through: { attributes: [ ] },
          required: false,
          duplicating: false
        },
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
        }
      ],
      group: [ db.sequelize.col('Podcast.id') ],
      raw: true
    })

    if(podcasts.length == 0) 
      return res.status(404).json({ message: 'No podcasts found' })

    podcasts.forEach(podcast => {
      if(podcast.average_rating === null)
        podcast.average_rating = 'No Ratings'
      else
        podcast.average_rating = parseFloat(podcast.average_rating)
    })
    
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
        [db.sequelize.fn('array_agg', db.sequelize.fn('distinct', db.sequelize.col('Genres.name'))), 'genres'],
        [db.sequelize.cast(db.sequelize.fn('avg', db.sequelize.col('Podcast_Ratings.score')), 'decimal(10,2)'), 'average_rating'],
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
    podcasts.forEach(podcast => {
      if(podcast.average_rating === null) {
        podcast.average_rating = 'No Ratings'
      }
      else
      {
        podcast.average_rating = parseFloat(podcast.average_rating)
      }
    })
    
    console.log(podcasts);
    res.status(200).json(podcasts)
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' })
  }
})
podcastsRouter.get('/favourite/count/:podcastId', async (req, res) => {
  try
  {
    const { podcastId } = req.params
    const count = await db.User_favourite_Podcast.findAll({
      attributes: [
        [db.sequelize.cast(db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('User_favourite_Podcast.id'))), 'integer'), 'favourite_count']
      ],
      where: {
        podcast_id: podcastId
      }
    })
    if(count === null)
      return res.status(404).json({ message: 'Not found' })

    const fav_count = count[0].dataValues.favourite_count
    return res.status(200).json({ message: 'Successfully got count', count: fav_count })
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
  
})
podcastsRouter.post('/favourite/:podcastId', auth, async (req, res) => {
  const { podcastId } = req.params
  try {
    const [user_favourite_podcast, created] = await db.User_favourite_Podcast.findOrCreate({
      where: {
        podcast_id: podcastId,
        user_id: req.session.user.id
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
podcastsRouter.get('/favourite/state/:podcastId', auth, async (req, res) => {
  const { podcastId } = req.params

  try
  {
    const user_favourite_podcast = await db.User_favourite_Podcast.findOne({
      where: {
        podcast_id: podcastId,
        user_id: req.session.user.id
      }
    })

    return res.status(200).json({ state: user_favourite_podcast !== null })
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
})
podcastsRouter.get('/rate/current', auth, async (req, res) => {
  const { podcastId } = req.query
  try
  {
    const rating = await db.Podcast_Rating.findOne({
      where: {
        podcast_id: podcastId,
        user_id: req.session.user.id
      }
    })
    if(rating === null)
      return res.status(200).json({message: 'No ratings'})
    console.log(rating);
    return res.status(200).json(rating)
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
})
podcastsRouter.get('/rate/avg', async (req, res) => {
  const { podcastId } = req.query
  console.log(podcastId);
  try
  {
    const podcasts = await db.Podcast_Rating.findAll({
    attributes: [
      [db.sequelize.cast(db.sequelize.fn('avg', db.sequelize.col('Podcast_Rating.score')), 'decimal(10,2)'), 'average_rating']
    ],
    where: {
      podcast_id: podcastId
    },
    raw: true
    })
    if(podcasts[0]['average_rating'] === null) {
      return res.status(200).json({ average_rating: 'No ratings' })
    }
    const average_rating = parseFloat(podcasts[0]['average_rating'])
    return res.status(200).json({ average_rating })
  }
  catch (err)
  {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
  
})
podcastsRouter.post('/rate/:podcastId', auth, async (req, res) => {
  const { podcastId } = req.params
  const { score } = req.body

  try
  {
    const rating = await db.Podcast_Rating.findOne({
      where: {
        user_id: req.session.user.id,
        podcast_id: podcastId
      }
    })
    if(rating === null) {
      await db.Podcast_Rating.create({
        podcast_id: podcastId,
        user_id: req.session.user.id,
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
    const transaction = await db.sequelize.transaction();
    try
    {
      const podcast = await db.Podcast.create(podcastData, { transaction });
      const genrePromises = userGenres.map(async (genreName) => {
        const [genre, created] = await db.Genre.findOrCreate({
          where: { name: genreName },
          defaults: { name: genreName },
          transaction
        });
        return genre.id
      });
      const genreIds = await Promise.all(genrePromises)
      await podcast.save()
      await podcast.setGenres(genreIds, { transaction })
      await transaction.commit();
      res.status(201).json(podcast);
    }
    catch (error)
    {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: 'Error creating podcast' });
    }
  }
  catch (error)
  {
    console.error(error);
    res.status(500).json({ message: 'Error creating podcast' });
  }
})
podcastsRouter.post('/spotify/submit', async (req, res) => {
  const token = await getSpotifyToken()
  const { podcastId } = req.body
  const url = `https://api.spotify.com/v1/shows/${podcastId}`
  const userGenres = req.body.genres.map((g) => g.toLowerCase())

  try
  {
    const dataFromSpotify = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    console.log(dataFromSpotify);
    const podcastData = {
      title: dataFromSpotify.data.name,
      description: dataFromSpotify.data.description,
      youtube_link: dataFromSpotify.data.external_urls.youtube || null,
      spotify_link: dataFromSpotify.data.external_urls.spotify,
      third_link: null,
      image_path: dataFromSpotify.data.images[0].url
    }
    const transaction = await db.sequelize.transaction();
    try
    {
      const podcast = await db.Podcast.create(podcastData, { transaction });
      const genrePromises = userGenres.map(async (genreName) => {
        const [genre, created] = await db.Genre.findOrCreate({
          where: { name: genreName },
          defaults: { name: genreName },
          transaction
        });
        return genre.id
      });
      const genreIds = await Promise.all(genrePromises)
      await podcast.save()
      await podcast.setGenres(genreIds, { transaction })
      await transaction.commit();
      res.status(201).json(podcast);
    }
    catch (error)
    {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: 'Error creating podcast' });
    }
  }
  catch (error)
  {
    console.error(error);
    res.status(500).json({ message: 'Error creating podcast' });
  }
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
  try
  {
    const url = `https://accounts.spotify.com/api/token`
    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
    const response = await axios.post(url, { grant_type: 'client_credentials' }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` } })
    console.log(response.data);
    return response.data.access_token
  }
  catch(err)
  {
    console.log(err);
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