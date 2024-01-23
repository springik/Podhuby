const express = require('express');
const bcrypt = require('bcrypt');
const registerRouter = express.Router();
const passwordHasher = require('../Middleware/passwordHasher.js');


const registerQuery = process.env.QUERY_REGISTER;
registerRouter.use(passwordHasher);

registerRouter.post('/register', (req, res) => {
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    const pool = req.app.locals.pool;
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err);
            res.status(500);
            throw err;
        }

        connection.query(registerQuery, [userEmail, userName, userPassword], (err) => {
            console.log("Releasing connection...");
            connection.release();
            
            if (err) {
                //handles response for general error
                res.status(500).json({ errno: err.errno, message: err.code });
                //throw err;
            }
            else {
                res.status(200).json({ message: 'Successfully registered' });
            }
        });
    });
});

module.exports = registerRouter;