const express = require('express')
const podcastsRouter = express.Router()
const db = require('../Sequelize/models');
const axios = require('axios')
const {Op, where, QueryTypes} = require('sequelize')
const sessionPreparer = require('../Middleware/sessionPreparer.js')

podcastsRouter.use(sessionPreparer)

//FIXME: add tags to the returned query
podcastsRouter.get('/all/:count?', async (req, res) => {
/*
    db.Podcast.findAll({
        attributes: ['id', 'title', 'description', 'youtube_link', 'spotify_link', 'third_link', 'image_path',
        [db.sequelize.fn('array_agg', db.sequelize.col('Genres.name')), 'genre_names'],
        //[db.sequelize.fn('array_agg', db.sequelize.col('Tags.name')), 'tag_names']],
        [db.sequelize.literal('(SELECT array_agg(DISTINCT Tags.name) FROM "Podcast_Tags" INNER JOIN "Tags" ON Podcast_Tags.tag_id = Tags.id WHERE Podcast_Tags.podcast_id = Podcast.id)'), 'tag_names']
        ],
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
            required: false,
            distinct: true
          }
        ],
        raw: true,
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
                genre_names: podcast.genre_names,
                tag_names: podcast.tag_names
            }
        })

        res.status(200).json(JSON.stringify(podcasts))
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    });
*/

  const query =
`SELECT Podcast.*, 
  array_agg(DISTINCT Genre.name) AS genre_names, 
  array_agg(DISTINCT Tag.name) AS tag_names
FROM "Podcasts" AS Podcast
JOIN "Podcast_Genres" AS genre_join ON Podcast.id = genre_join.podcast_id
JOIN "Genres" AS Genre ON genre_join.genre_id = Genre.id
JOIN "Podcast_Tags" AS tag_join ON Podcast.id = tag_join.podcast_id
JOIN "Tags" AS Tag ON tag_join.tag_id = Tag.id
GROUP BY Podcast.id;
`

  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT })

    if(result == null || result == undefined) {
      res.status(500).json({ message: 'No podcasts found' })
      return
    }

    res.status(200).json(result)
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
  }
})
podcastsRouter.get('/by-genre/:genres/:tags?', async (req, res) => {
  const { genres, tags } = req.params

  const query = `
SELECT
  p.id,
  p.title,
  p.description,
  p.youtube_link,
  array_agg(DISTINCT g.name) AS genre_names,
  array_agg(DISTINCT t.name) AS tag_names
FROM "Podcasts" p
JOIN "Podcast_Genres" pg ON p.id = pg.podcast_id
JOIN "Genres" g ON pg.genre_id = g.id
JOIN "Podcast_Tags" pt ON p.id = pt.podcast_id
JOIN "Tags" t ON pt.tag_id = t.id
WHERE g.name = ANY (ARRAY[:genres])
   OR t.name = ANY (ARRAY[:tags])
GROUP BY p.id;`

  const parameters = {
    genres: genres ? genres.split('-').map(genre => genre.trim()) : [],
    tags: tags ? tags.split('-').map(tag => tag.trim()) : [],
  }
  //console.log(parameters);

  try
  {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: parameters
    })
    if(result === null || result === undefined) {
      req.status(404).json({ message: 'No podcasts found' })
      return
    }

    res.status(200).json(result)
    return
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json(err)
    return
  }


})
podcastsRouter.get('/:podcastTitle', async (req, res) => {
  const { podcastTitle } = req.params

  const query = `
SELECT
  p.id,
  p.title,
  p.description,
  p.youtube_link,
  array_agg(DISTINCT g.name) AS genre_names,
  array_agg(DISTINCT t.name) AS tag_names
FROM "Podcasts" p
JOIN "Podcast_Genres" pg ON p.id = pg.podcast_id
JOIN "Genres" g ON pg.genre_id = g.id
JOIN "Podcast_Tags" pt ON p.id = pt.podcast_id
JOIN "Tags" t ON pt.tag_id = t.id
WHERE p.title = :title
GROUP BY p.id;`

  const parameters = {
    title: podcastTitle
  }
  console.log(parameters);

  try
  {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: parameters
    })
    if(result === null || result === undefined) {
      res.status(404).json({ message: 'Podcast not found' })
      return
    }

    res.status(200).json(result)
    return
  }
  catch (err)
  {
    console.log(err);
    res.status(500).json({ message: 'Server error' })
    return
  }
})
podcastsRouter.get('/:podcastId(\\d+)', (req, res) => {
    
})
podcastsRouter.post('/favourite/:podcastId', async (req, res) => {
  if(req.session.data.user == undefined || req.session.data.user == null) {
    res.status(401).json({ message: 'User not authorized' })
    return
  }

  try {
    const [user_favourite_podcast, created] = await db.User_favourite_Podcast.findOrCreate({
      where: {
        podcast_id: req.params.podcastId,
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

podcastsRouter.post('/youtube/submit', async (req, res) => {
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
      await db.sequelize.query('insert into "Podcast_Genres" values($podcast, $genre)', { bind: { podcast: podcast.dataValues.id, genre: genre.dataValues.id }, type: QueryTypes.INSERT})
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
module.exports = podcastsRouter