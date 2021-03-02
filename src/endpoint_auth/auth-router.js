const express = require('express');


const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .route('/')
    .get( (req, res, next) => {
        res.send(`You successfully submitted a GET /auth API call.`)
    });

module.exports = authRouter;