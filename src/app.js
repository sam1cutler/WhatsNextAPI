require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
// require CLIENT_ORIGIN

/*-- require routers --*/
const showsRouter = require('./endpoint_shows/shows-router');
const usersRouter = require('./endpoint_users/users-router');
const authRouter = require('./endpoint_auth/auth-router');
const friendsRouter = require('./endpoint_friends/friends-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev' ;

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/api/', (req, res) => {
    res.send(`Hello, What's Next? user!`);
})

/*-- app.use routers --*/
app.use('/api/shows', showsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/friends', friendsRouter);

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

module.exports = app;