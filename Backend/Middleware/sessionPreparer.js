const express = require('express');

//TODO: Refactor this so it's more readable
module.exports = function userSessionCheck(req, res, next) {
    if(!req.session.data) {
        req.session.data = {};
    }
    //TODO: query the db with the session id and incase a session is found that is valid load it into memory and if entries are found extend its lifetime
    const pool = req.app.locals.pool;
    pool.getConnection((err, connection) => {
        const checkQuery = process.env.QUERY_SESSION_CHECK
        connection.query(checkQuery, [req.sessionID], (err, results) => {
            if(err) {
                console.log(err);
                res.status(500).json({ message: err.code, errno: err.errno });
            }

            if(results.length > 1) {
                console.error("Found multiple matching sessions in DB!")
                res.status(500).json({ message: "Multiple sessions found!" })
            }

            if(results.length === 0) {
                console.log("No session entry found in DB");
                return
            }

            if(results[0].expires < Date.now()) {
                console.log("returned from db: " + results[0].data);
                const parsedData = JSON.parse(results[0].data)
                console.log("parsed data: " + parsedData);

                req.session.data = parsedData

                const updateQuery = process.env.QUERY_SESSION_EXPIRATION_UPDATE
                connection.query(updateQuery, (err) => {
                    if(err) {
                        console.log(err);
                        res.status(500).json({ message: err.code, errno: err.errno })
                    }
                })
            }
            connection.release()
            console.log("sessionPreparer released connection");
        })
    })

    if(!req.session.data.user) {
        req.session.data.user = {
            //Email: undefined,
            //Name: undefined
        };
    }
    next();
}