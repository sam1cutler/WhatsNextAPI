const path = require('path');
const express = require('express');
const FriendsService = require('./friends-service');
const UsersService = require('../endpoint_users/users-service');
const JwtService = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
const jsonParser = express.json();

friendsRouter
    .route('/')
    .all(JwtService.requireAuth)
    .get( (req, res, next) => {
        FriendsService.getFriends(
            req.app.get('db'),
            req.user.id
        )
            .then(friendsList => {
                res
                    .json(friendsList)
            })
    })
    .post(jsonParser, (req, res, next) => {

        // destructure target from request body
        const { target_friend_email } = req.body

        // check for required fields
        if (!target_friend_email) {
            return res
                .status(400)
                .json({
                    error: `Must provide email address of friend.`
                })
        }

        // check that user isn't somehow attempting to friend themself
        if ( target_friend_email === req.user.email ) {
            return res
                .status(400)
                .json({
                    error: `You can't friend yourself! At least, not here.`
                })
        }

        // check that requested user actually exists
        UsersService.checkForUserWithEmail(
            req.app.get('db'),
            target_friend_email
        )
            .then(userWithThatEmail => {
                if (!userWithThatEmail) {
                    return res
                        .status(400)
                        .json({
                            error: `Cannot find user with the email address '${target_friend_email}'.`
                        })
                }

                // check that user isn't already friends with this person
                FriendsService.getFriends(
                    req.app.get('db'),
                    req.user.id
                )
                    .then(friendsList => {
                        for (let i=0 ; i<friendsList.length ; i++) {
                            if (userWithThatEmail.id === friendsList[i].recipient_id) {
                                return res
                                    .status(400)
                                    .json({
                                        error: `Already friends with the user with email address '${target_friend_email}'.`
                                    })
                            }
                        }

                        // once confirm user does exist + is not already a friend, 
                        //    use that info to populate the appropriate DB call:
                        const newConnection = {
                            source: req.user.id,
                            recipient_id: userWithThatEmail.id,
                            recipient_name: userWithThatEmail.display_name
                        }
                        
                        FriendsService.makeNewConnection(
                            req.app.get('db'),
                            newConnection
                        )
                            .then(connection => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/$${connection.id}`))
                                    .json(connection)
                            })
                            .catch(next)
                    })

                
            })
    });
    

friendsRouter
    .route('/:connectionId')
    .all(JwtService.requireAuth)
    .all( (req, res, next) => {
        FriendsService.getSpecificConnection(
            req.app.get('db'),
            req.params.connectionId
        )
            .then(connection => {
                if (!connection) {
                    return res
                        .status(404)
                        .json({
                            error: `The requested connection could not be found.`
                        })
                }

                if (connection.source !== req.user.id) {
                    return res
                        .status(400)
                        .json({
                            error: `User making the request is not authorized to access this connection.`
                        })
                }
                next()
            })
    })
    .get( (req, res, next) => {
        FriendsService.getSpecificConnection(
            req.app.get('db'),
            req.params.connectionId
        )
            .then(connection => {
                res.json(connection)
            })
    })
    .delete( (req, res, next) => {
        FriendsService.deleteConnection(
            req.app.get('db'),
            req.params.connectionId
        )
            .then( () => {
                res
                    .status(204)
                    .end()
            })
    })



module.exports = friendsRouter;