const express = require('express');
const path = require('path');
const showsService = require('./shows-service');


const showsRouter = express.Router();
const jsonParser = express.json();

showsRouter
    .route('/')
    .get( (req, res, next) => {
        console.log('attempting GET request of shows endpoint')
        showsService.getAllShows(
            req.app.get('db'),
            1
        )
        .then(shows => {
            //console.log(shows)
            res.json(shows.map(showsService.serializeShowData))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        console.log('in shows router, request body is:')
        console.log(req.body)
        const { title, service, genre, watched, priority, completed, rating } = req.body;
        // want to keep thinking about what is "required", and at what stage...
        //   ...e.g., will I fill in default values in the front-end app if not supplied by user,
        //   or be okay with legit nulls for some values?
        const requiredItems = { title, watched };

        for (const [key, value] of Object.entries(requiredItems)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: {message: `New show submission must include '${key}'.`}
                    })
            }
        }

        const newShow = {
            // user_id: req.user.id
            user_id: 2,
            title,
            service,
            genre,
            watched, 
            priority,
            completed,
            rating
        }

        showsService.insertShow(
            req.app.get('db'),
            newShow
        )
            .then(show => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${show.id}`))
                    .json(showsService.serializeShowData(show))
            })
            .catch(next)
    })

module.exports = showsRouter;