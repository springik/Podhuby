const express = require('express');
const loginRouter = express.Router();
const userSessionCheck = require('../Middleware/userSessionCheck.js');
const isLoggedIn = require('../Middleware/isLoggedIn.js');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
const loginQuery = "SELECT email, nickname, password FROM users WHERE email = ? OR nickname = ? AND password = ?;";
loginRouter.use(userSessionCheck);
loginRouter.use(isLoggedIn);

loginRouter.post('/login', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    connection.query(loginQuery, [userEmail, userName, userPassword], (err, results) => {
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        
        if(results.length == 0) {
            res.status(500).json(req.session.user);
        }
        else {
            req.session.user = {
                Email: userEmail,
                Name: userName,
                Password: userPassword
            }
            res.status(200).json(req.session.user);
        }
    });
});

module.exports = loginRouter;