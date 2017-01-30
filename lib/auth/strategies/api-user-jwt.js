'use strict';

const internals = {};

module.exports = (srv, options) => {

    return {
        name: 'api-user-jwt',
        scheme: 'jwt',
        options: {
            apiUserJwt: true,
            key: options.secrets.jwtSecret,
            /**
             * [validateFunc description]
             * @param    decoded    decoded but unverified JWT token
             * @param    request    original request received from client
             * @param    callback function, must have signature (err,valid,credentials(optional))
             */
            validateFunc: (decoded, request, reply) => {

                const Models = request.models(true);
                const Tokens = Models.Tokens;
                const Users = Models.Users;

                Tokens.query().findById(decoded.jti)
                .asCallback((err, token) => {

                    if (err) {
                        return reply(err);
                    }

                    if (token) {
                        Users.query().findById(token.user)
                        .asCallback((usrErr, user) => {

                            if (usrErr) {
                                return reply(usrErr);
                            }

                            if (typeof (user) !== 'undefined') {

                                reply(null, true, { user });
                            }
                            else {

                                reply(null,false);
                            }
                        });
                    }
                    else {
                        return reply(null, false);
                    }
                });
            },
            verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
        }
    };
};
