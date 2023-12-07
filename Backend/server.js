const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.listen(8000);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    cookie: {maxAge: 86400000},
    resave: false,
    saveUninitialized: false
}));


const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/users', loginRouter, registerRouter);