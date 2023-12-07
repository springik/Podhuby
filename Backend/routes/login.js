const express = require('express');
const loginRouter = express.Router();
const sessionPreparer = require('../Middleware/sessionPreparer.js');
const isLoggedIn = require('../Middleware/isLoggedIn.js');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
const loginQuery = "SELECT email, nickname, password FROM users WHERE email = ? OR nickname = ? AND password = ?;";
loginRouter.use(sessionPreparer);
//loginRouter.use(isLoggedIn);

loginRouter.post('/login', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    connection.query(loginQuery, [userEmail, userName, userPassword], (err, results) => {
        if(err) {
            res.status(500).send(err.message);
            //throw err;
        }
        
        if(results.length == 0) {
            res.sendStatus(500);
        }
        else {
            req.session.user = {
                Email: userEmail,
                Name: userName,
                Password: userPassword
            }
            res.sendStatus(200);
        }
    });
});

module.exports = loginRouter;