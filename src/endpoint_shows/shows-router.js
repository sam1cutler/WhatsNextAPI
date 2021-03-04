const express = require('express');
const path = require('path');
const showsService = require('./shows-service');
const JwtService = require('../middleware/jwt-auth');


const showsRouter = express.Router();
const jsonParser = express.json();

// public GET /shows/get/:userId requests need userId from req URL
showsRouter
    .route('/get/:userId')
    .get( (req, res, next) => {
        showsService.getAllShows(
            req.app.get('db'),
            req.params.userId
        )
        .then(shows => {
            res.json(shows.map(showsService.serializeShowData))
        })
        .catch(next)
    });

// private POST /shows requests pull userId from user's authToken
showsRouter
    .route('/')
    .all(JwtService.requireAuth)
    .post(jsonParser, (req, res, next) => {

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
            user_id: req.user.id,
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
    });

// public GET /shows/get/:userId/:showId requests pull userId from req URL
showsRouter
    .route('/get/:userId/:showId')
    .all( (req, res, next) => {
        showsService.getShowById(
            req.app.get('db'),
            req.params.showId
        )
        .then(show => {
            if (!show) {
                return res
                    .status(404)
                    .json({
                        error: {message: `The show with ID '${req.params.showId}' could not be found.`}
                    })
            }

            // check that the show (which exists) is "owned" by the specific user
            if (show.user_id !== parseInt(req.params.userId) ) {
                return res
                    .status(404)
                    .json({
                        error: { message: `Show #${req.params.showId} is not associated with this user's account.`}
                    })
            }

            res.show = show;
            next()
        })
    })
    .get( (req, res, next) => {
        res.json(
            showsService.serializeShowData(res.show)
        )
    })

// private PATCH and DELETE /shows/:showId requests pull userId from authToken
showsRouter
    .route('/:showId')
    .all(JwtService.requireAuth)
    .all( (req, res, next) => {
        showsService.getShowById(
            req.app.get('db'),
            req.params.showId
        )
        .then(show => {
            if (!show) {
                return res
                    .status(404)
                    .json({
                        error: {message: `The show with ID '${req.params.showId}' could not be found.`}
                    })
            }

            // check that the show (which exists) is "owned" by 
            //    the specific authToken-verified user making this request
            if (show.user_id !== req.user.id) {
                return res
                    .status(404)
                    .json({
                        error: { message: `The user making this request about show #${req.params.showId} is not authorized to do so.`}
                    })
            }

            res.show = show;
            next()
        })
    })
    .delete( (req, res, next) => {
        showsService.deleteShow(
            req.app.get('db'),
            req.params.showId
        )
            .then( () => {
                res
                    .status(204)
                    .end()
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, service, genre, watched, priority, completed, rating } = req.body;
        const updatedShowInfo = { 
            user_id: req.user.id,
            title, 
            service, 
            genre, 
            watched, 
            priority, 
            completed, 
            rating 
        };

        showsService.updateShow(
            req.app.get('db'),
            req.params.showId,
            updatedShowInfo
        )
            .then( () => {
                res
                    .status(204)
                    .end()
            })
            .catch(next)
    })
    

module.exports = showsRouter;