const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret-key',
    cookie: { maxAge: 3_600_000 },
    resave: false,
    saveUninitialized: false
}))
const corsOptions = {
    origin: 'http://localhost:8081',
    optionSuccessStatus: 200,
    credentials: true,
}
app.listen(process.env.PORT || 8080)

const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const podcastsRouter = require('./routes/podcasts.js')
const userDataRouter = require('./routes/userdata.js')

app.use('/users', cors(corsOptions), loginRouter, registerRouter)
app.use('/podcasts', cors(corsOptions), podcastsRouter)