const express = require('express')
const podcastsRouter = express.Router()

podcastsRouter.get('/all/:count?', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const count = Number(req.params.count) || 10_000
        const query = process.env.QUERY_GET_PODCAST_ALL
        
        connection.query(query, [count], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code })

            res.status(200).json(results)
        })
        connection.release();
    })
})
podcastsRouter.get('/by-genre/:podcastGenre/:tags?(^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$)', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const genre = req.params.podcastGenre

        if(req.params.tags === undefined) {
            const query = process.env.QUERY_GET_PODCAST_BY_GENRE
        
        connection.query(query, [genre], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code })

            res.status(200).json(results)
        })
        }
        else {
            //TODO: Write query for selecting this
            const tags = req.params.tags.split('-')
            const query = process.env.QUERY_GET_PODCAST_BY_GENRE_TAGGED

            connection.query(query, [genre, tags], (err, results) => {
                if(err)
                    res.status(500).json({ errno: err.errno, message: err.code })
    
                res.status(200).json(results)
            })
        }
        
        connection.release();
    })
})
podcastsRouter.get('/:podcastId(\\d+)', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const id = Number(req.params.podcastId) || 1
        const query = process.env.QUERY_GET_PODCAST_BY_ID
        connection.query(query, [id], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code });

            res.status(200).json(results)
        })
    })
})
podcastsRouter.get('/:podcastTitle(^[a-zA-Z0-9]+$)', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const query = process.env.QUERY_GET_PODCAST_BY_TITLE
        connection.query(query, [req.params.podcastTitle], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code });

            res.status(200).json(results)
        })
    })
})

module.exports = podcastsRouter