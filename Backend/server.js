const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.listen(3000);
app.use(bodyParser.urlencoded({ extended: false }));

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/users', loginRouter, registerRouter);