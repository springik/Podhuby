const express = require('express')
const genreRouter = express.Router()
const db = require('../Sequelize/models')

genreRouter.get('/all', async (req, res) => {
    try
    {
        const genres = await db.Genre.findAll()
        if(genres.length === 0)
            return res.status(404).json({ message: 'No genre was found' })

        return res.status(200).json(genres)
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ message:'Something went wrong' })
    }
})

module.exports = genreRouter