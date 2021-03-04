const path = require('path');
const express = require('express');
const UsersService = require('./users-service');
const JwtService = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .route('/')
    .get( (req, res, next) => {
        UsersService.getAllUsers(
            req.app.get('db')
        )
            .then(users => {
                res
                    .json(
                        users.map(UsersService.serializeUser)
                    )
            })
    })
    .post(jsonParser, (req, res, next) => {

        const { email, display_name, password } = req.body;
        let newUser = { email, display_name, password };

        // check all required info has some value
        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: `New user registration must include '${key}'.`
                    })
            }
        }

        // check whether email is taken
        UsersService.checkForUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(dbHasUserWithEmail => {
                if (dbHasUserWithEmail) {
                    return res
                        .status(400)
                        .json({
                            error: `User with the email ${email} has already registered.`
                        })
                }

                const passwordError = UsersService.validatePassword(password);

                if (passwordError) {
                    return res
                        .status(400)
                        .json({
                            error: passwordError
                        })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        newUser['password'] = hashedPassword;
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))

                            })
                    })
            })
            .catch(next)
    });

usersRouter
    .route('/:userId')
    .all( (req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.userId
        )
            .then(user => {
                if (!user) {
                    return res
                        .status(404)
                        .json({
                            error: `The user with ID '${req.params.userId}' could not be found.`
                        })
                }
                res.user = user;
                next()
            })
    })
    .get( (req, res, next) => {
        res.json(UsersService.serializeUser(res.user))
    })
    .delete(JwtService.requireAuth, (req, res, next) => {

        // check that the user (who exists) is the same as 
        //    the JWT-authenticated user asking to delete their acct
        if (req.user.id !== res.user.id ) {
            return res
                .status(404)
                .json({
                    error: { message: `The user making this account-delete request is not authorized to do so.`}
                })
        }
        

        UsersService.deleteUser(
            req.app.get('db'),
            req.params.userId
        )
            .then( () => {
                res
                    .status(204)
                    .end()
                    /*
                    .json({
                        message: `You have successfully deleted the user associated with ${res.user.email}.`
                    })
                    */
            })
    })
    .patch(
        JwtService.requireAuth, 
        jsonParser, 
        (req, res, next) => {
            const { email, password, display_name, friends } = req.body;
            const updatedUserInfo = { email, password, display_name, friends };
            const numberOfChanges = Object.values(updatedUserInfo).filter(Boolean).length;

            if (numberOfChanges === 0) {
                return res
                    .status(400)
                    .json({
                        error: { message: `Must update at least one user account feature.`}
                    })
            }

            if (password) {
                const passwordError = UsersService.validatePassword(password);

                if (passwordError) {
                    return res
                        .status(400)
                        .json({
                            error: passwordError
                        })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        updatedUserInfo['password'] = hashedPassword;
                    })
            }

            return UsersService.updateUser(
                req.app.get('db'),
                req.params.userId,
                updatedUserInfo
            )
                .then( () => {
                    res
                        .status(204)
                        .end()
                })
                .catch(next)
        })

module.exports = usersRouter;