'use strict';

module.exports = [{
    method: 'get',
    path: '/user/{id}/dogs',
    handler: function (request, reply) {

        reply({ x: true });
    }
}];
