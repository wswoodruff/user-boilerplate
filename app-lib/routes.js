'use strict';

const Boom = require('boom');

module.exports = [{
    method: 'get',
    path: '/users/{id}/dog',
    handler: function (request, reply) {

        const Users = request.models(true).Users;

        Users.query().findById(request.params.id).eager('dog')
        .asCallback((err, user) => {

            if (err) {
                return reply(err);
            }

            if (!user) {
                return reply(Boom.notFound('User not found'));
            }

            return reply(user.dog);
        });
    }
}];
