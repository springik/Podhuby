const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

const app = express()

app.use('/pfps' , express.static(path.join(__dirname + '/public/Images/pfps')))
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
const commentsRouter = require('./routes/comments.js')
const adminActionsRouter = require('./routes/adminActions.js')
const authMiddleware = require('./Middleware/auth.js')

app.use('/users', cors(corsOptions), loginRouter, registerRouter)
app.use('/podcasts', cors(corsOptions), podcastsRouter, commentsRouter)
app.use('/admin', cors(corsOptions), authMiddleware, adminActionsRouter)