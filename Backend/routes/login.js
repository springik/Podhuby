const express = require('express');
const bcrypt = require('bcrypt');
const loginRouter = express.Router();
const sessionPreparer = require('../Middleware/sessionPreparer.js');

const loginQuery = process.env.QUERY_LOGIN;
loginRouter.use(sessionPreparer);

loginRouter.post('/login', (req, res) => {
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    const pool = req.app.locals.pool;
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            throw err;
        }

        connection.query(loginQuery, [userEmail, userPassword], (err, results) => {
            if (err) {
                //handles response for general errors
                res.status(500).json({ errno: err.errno, message: err.code });
                //throw err;
            }
            else if (results.length == 0) {
                res.status(500).json({ message: 'User not found' });
            }
            else if (checkPassword(userPassword, results[0].password)) {
                if(!req.session.data.user) {
                    req.session.data.user = {
                        Email: userEmail,
                        Name: results[0].nickname
                    }

                    //FIXME: DOESN'T INSERT INTO DB
                    const JSONData = JSON.stringify(req.session.data)
                    console.log("json in login" + JSONData);
                    const insertQuery = process.env.QUERY_SESSION_INSERT
                    connection.query(insertQuery,[req.sessionID, req.session.cookie.expires, JSONData] , (err) => {
                        if(err) {
                            console.log(err);
                            res.status(500).json({ errno: err.errno, message: err.code })
                        }
                    })
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