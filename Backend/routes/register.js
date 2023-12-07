const express = require('express');
const registerRouter = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
const registerQuery = 'INSERT INTO users(email, nickname, password, pfpPath) VALUES(?, ?, ?, ?);';

registerRouter.post('/register', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;
    const pfpPath = '/Images/pfps/default_pfp';

    connection.query(registerQuery, [userEmail, userName, userPassword, pfpPath], (err, result) => {
        if(err) {
            //handles response for general error
            res.status(500).json({ errno: err.errno, message: err.code});
            //throw err;
        }
        else {
            res.status(200).send('Successfully registered');
        }
    });
});

module.exports = registerRouter;