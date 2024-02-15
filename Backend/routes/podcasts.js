const express = require('express')
const podcastsRouter = express.Router()

//FIXME: REDO quering

podcastsRouter.get('/all/:count?', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const count = Number(req.params.count) || 10_000
        const query = process.env.QUERY_GET_PODCAST_ALL
        
        connection.query(query, [count], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code })

            res.status(200).json(results)
        })
        connection.release()
    })
})
podcastsRouter.get('/by-genre/:genre([a-zA-Z0-9]+)/:tags?', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const { genre, tags } = req.params

        if(tags === undefined) {
            const query = process.env.QUERY_GET_PODCAST_BY_GENRE
            console.log(genre)
        
            connection.query(query, [genre], (err, results) => {
                if(err) {
                    res.status(500).json({ errno: err.errno, message: err.code })
                }
            
                res.status(200).json(results)
            })
        }
        else {
            //FIXME: DB throws parse error ie I need to insert sthing like this: ( "test", "test2" )
            const query = process.env.QUERY_GET_PODCAST_BY_GENRE_TAGGED

            let tagsArr = tags.split('-')
            tagsArr = JSON.stringify(tagsArr)
            console.log(tagsArr)

            connection.query(query, [tagsArr, genre, tags.length], (err, results) => {
                if(err)
                    res.status(500).json({ errno: err.errno, message: err.code })
    
                res.status(200).json(results)
            })
        }
        
        connection.release()
    })
})
podcastsRouter.get('/:podcastId(\\d+)', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const id = Number(req.params.podcastId) || 1
        const query = process.env.QUERY_GET_PODCAST_BY_ID
        connection.query(query, [id], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code })

            res.status(200).json(results)
        })
    })
})
podcastsRouter.get('/:podcastTitle(^[a-zA-Z0-9]+$)', (req, res) => {
    req.app.locals.pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.status(500).json({ errno: err.errno, message: err.code })
        }
        const query = process.env.QUERY_GET_PODCAST_BY_TITLE
        connection.query(query, [req.params.podcastTitle], (err, results) => {
            if(err)
                res.status(500).json({ errno: err.errno, message: err.code })

            res.status(200).json(results)
        })
    })
})

module.exports = podcastsRouter