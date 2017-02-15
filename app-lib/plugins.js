'use strict';

const Hoek = require('hoek');
const Users = require('./schwifty-models/users');

module.exports = (srv, options) => ([{
    plugins: {
        register: require('../lib'),
        options: Hoek.applyToDefaults(options, { Users })
    }
}]);
