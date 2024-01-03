const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.listen(8080);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    cookie: {maxAge: 86400000},
    resave: false,
    saveUninitialized: false
}));
const corsOptions = {
    origin: 'http://localhost:8081',
    optionSuccessStatus: 200
}


const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/users', cors(corsOptions), loginRouter, registerRouter);