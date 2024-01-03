const express = require('express');
const loginRouter = express.Router();
const sessionPreparer = require('../Middleware/sessionPreparer.js');
const isLoggedIn = require('../Middleware/isLoggedIn.js');

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 99,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
const loginQuery = "SELECT email, nickname, password FROM users WHERE email = ? AND nickname = ? AND password = ?;";
loginRouter.use(sessionPreparer);
//loginRouter.use(isLoggedIn);

loginRouter.post('/login', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    pool.query(loginQuery, [userEmail, userName, userPassword], (err, results) => {
        if(err) {
            //handles response for general errors
            res.status(500).json({errno: err.errno, message: err.code});
            //throw err;
        }
        else if(results.length == 0){
                res.status(500).json({message: 'User not found'});
            
        }
        else {
            req.session.user = {
                Email: userEmail,
                Name: userName,
                Password: userPassword
            }
            res.status(200).json({message: 'Successfully logged in'});
        }
        
        
    });
});

module.exports = loginRouter;