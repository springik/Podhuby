const express = require('express');
const bcrypt = require('bcrypt');
const loginRouter = express.Router();
const sessionPreparer = require('../Middleware/sessionPreparer.js');

const loginQuery = process.env.QUERY_LOGIN;
loginRouter.use(sessionPreparer);

loginRouter.post('/login', (req, res) => {
    /*
    if(typeof req.session.data.user !== 'undefined') {
        res.status(409).json({ message: 'Conflicting information!' })
    }
    */

    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    console.log("Email: " + userEmail + "\nPassword: " + userPassword);

    const pool = req.app.locals.pool;
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500).json({ errno: err.errno, message: err.code })
        }

        connection.query(loginQuery, [userEmail, userPassword], (err, results) => {
            if (err) {
                res.status(500).json({ errno: err.errno, message: err.code });
            }

            if (results.length === 0) {
                res.status(500).json({ message: 'User not found' });
            }

            if (checkPassword(userPassword, results[0].password)) {
                // If the user doesn't exist in session
                // Create it and insert the session into the DB as it wasn't recovered from the DB
                if(!req.session.data.user) {
                    req.session.data.user = {
                        Email: userEmail,
                        Name: results[0].nickname
                    }

                    const JSONData = JSON.stringify(req.session.data)
                    console.log("json in login" + JSONData);
                    const insertQuery = process.env.QUERY_SESSION_INSERT
                    console.log(req.session.cookie);
                    connection.query(insertQuery,[req.sessionID, req.session.cookie._expires, JSONData] , (err) => {
                        if(err) {
                            console.log(err);
                            res.status(500).json({ errno: err.errno, message: err.code })
                        }
                    })
                }
                // If the session was recovered from the DB
                // Update it just in case (most of the times it should not be different)
                req.session.data.user = {
                    Email: results[0].email,
                    Name: results[0].nickname
                }
                
                console.log(req.sessionID);
                console.log(req.session);
                res.status(200).json({ message: 'Successfully logged in' });
            }

            console.log("Releasing connection...");
            connection.release();
        });
    });

    
});

const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
};
module.exports = loginRouter;