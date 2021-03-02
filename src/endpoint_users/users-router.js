const express = require('express');


const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .get( (req, res, next) => {
        res.send(`You successfully submitted a GET /users API call.`)
    });

module.exports = usersRouter;