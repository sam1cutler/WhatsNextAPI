const AuthService = require("../endpoint_auth/auth-service");


const JwtService = {

    requireAuth(req, res, next) {

        console.log('Running requireAuth')
        // Get AuthToken from Auth header of 
        //    client's request to protected endpoint
        const AuthToken = req.get('Authorization') || '';

        // check proper formatting of auth token
        if (!AuthToken.toLowerCase().startsWith('bearer ')) {
            return res
                .status(401)
                .json({
                    error: 'Missing properly-formatted bearer token.'
                })
        } else {
            // if token is correctly formatted --> isolate it (by removing "bearer ")
            bearerToken = AuthToken.slice(7, AuthToken.length);
        }

        // verify that user exists in DB
        try {
            const payload = AuthService.verifyJwt(bearerToken);
            // ^^ verifyJwt returns a jwt.verify object of a specific structure...

            // ...which can be further de-structured to reveal the user's email, 
            //    which I put in when I made the token.
            AuthService.getUserWithUserEmail(
                req.app.get('db'),
                payload.sub
            )
                .then(user => {
                    if (!user) {
                        return res
                            .status(401)
                            .json({
                                error: 'Unauthorized request - cannot find this user.'
                            })
                    }

                    // if user DOES exist --> put user's info in request
                    req.user = user;
                    next()
                })
                .catch(err => {
                    next(error)
                })
        } catch(error) {
            res
                .status(401)
                .json({
                    error: 'Unauthorized request - trying token verification failed.'
                })
        }
    }

}

module.exports = JwtService;