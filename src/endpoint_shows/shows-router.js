const express = require('express');


const showsRouter = express.Router();
const jsonParser = express.json();

showsRouter
    .route('/')
    .get( (req, res, next) => {
        res.send(`You successfully submitted a GET /shows API call.`)
    });

module.exports = showsRouter;