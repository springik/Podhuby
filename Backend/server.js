const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    cookie: { maxAge: 3_600_000 },
    resave: false,
    saveUninitialized: false
}));
const corsOptions = {
    origin: 'http://localhost:8081',
    optionSuccessStatus: 200
}
const pool = mysql.createPool({
    connectionLimit: 99,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'podhubydb'
});
app.locals.pool = pool;

app.listen(process.env.PORT || 8080);

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/users', cors(corsOptions), loginRouter, registerRouter);