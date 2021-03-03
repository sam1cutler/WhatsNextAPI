const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        const { email, password } = req.body;
        const loginUser = { email, password };

        // confirm have both email + pw
        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res
                    .status(400)
                    .json({
                        error: `Missing '${key}' in request body.`
                    })
            }
        }

        // Check that user exists
        AuthService.getUserWithUserEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(verifiedUser => {
                if (!verifiedUser) {
                    return res
                        .status(400)
                        .json({
                            error: 'Cannot find user.'
                        })
                }

                // if user exists, check that password in req.body
                //  matches DB-stored bcrypted password for the verified user
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(comparisonResult => {
                        if (!comparisonResult) {
                            return res
                                .status(400)
                                .json({
                                    error: `Incorrect password.`
                                })
                        }

                        // by now, email/pass combo are validated 
                        //    --> need to make JWT (sub = email from DB, payload: user_id object)
                        const sub = verifiedUser.email;
                        const payload = { user_id: verifiedUser.id };
                        const authToken = AuthService.createJwt(sub, payload);
                        res.send({
                            authToken
                        })
                    })

            })
            .catch(next)
    });

module.exports = authRouter;