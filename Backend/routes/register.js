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

    connection.connect();
    connection.query(registerQuery, [userEmail, userName, userPassword, pfpPath], (err, result) => {
        if(err) {
            //handles response for non unique error mysql errorcode #1169
            if(err.code === 1169) {
                res.status(500).send(err.message);
            }
            res.status(500).send(err);
            throw err;
        }
        else {
            res.status(200).send('Successfully registered');
        }
    });
    connection.end();
});

module.exports = registerRouter;