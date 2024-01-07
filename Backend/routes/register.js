const express = require('express');
const bcrypt = require('bcrypt');
const registerRouter = express.Router();
const passwordHasher = require('../Middleware/passwordHasher.js');

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 99,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
const registerQuery = 'INSERT INTO users(email, nickname, password, pfpPath) VALUES(?, ?, ?, ?);';
registerRouter.use(passwordHasher);

registerRouter.post('/register', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;
    const pfpPath = '/Images/pfps/default_pfp';

    pool.query(registerQuery, [userEmail, userName, userPassword, pfpPath], (err) => {
        if(err) {
            //handles response for general error
            res.status(500).json({ errno: err.errno, message: err.code});
            //throw err;
        }
        else {
            res.status(200).json({message: 'Successfully registered'});
        }
    });
});

module.exports = registerRouter;