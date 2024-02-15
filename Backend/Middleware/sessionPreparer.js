const express = require('express')

//FIXME: REDO quering
module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.data) {
        req.session.data = {}
    }
    const pool = req.app.locals.pool
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.status(500).json({ message: err.code, errno: err.errno })
        }
        
        const checkQuery = process.env.QUERY_SESSION_CHECK
        connection.query(checkQuery, [req.sessionID], (err, results) => {
            if(err) {
                console.log(err)
                res.status(500).json({ message: err.code, errno: err.errno })
            }

            if(results.length > 1) {
                console.error("Found multiple matching sessions in DB!")
                res.status(500).json({ message: "Multiple sessions found!" })
            }

            if(results.length === 0) {
                console.log("No session entry found in DB")
                // Releases the connection early and calls the next middleware
                connection.release()
                console.log("sessionPreparer released connection...")
                next()
                return
            }

            if(results[0].expires < Date.now()) {
                console.log("returned from db: " + results[0].data)
                const parsedData = JSON.parse(results[0].data)
                console.log("parsed data: " + parsedData)

                req.session.data = parsedData

                // Updates expiration time, when a session is found
                const updateQuery = process.env.QUERY_SESSION_EXPIRATION_UPDATE
                connection.query(updateQuery, (err) => {
                    if(err) {
                        console.log(err)
                        res.status(500).json({ message: err.code, errno: err.errno })
                    }
                })
                // Adds an hour to the expiration time
                req.session.cookie.maxAge = Date.now() + 3_600_000
            }

            connection.release()
            console.log("sessionPreparer released connection...")
            next()
        })

    })
}