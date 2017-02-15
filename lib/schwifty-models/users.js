'use strict';

const Model = require('schwifty').Model;
const Hoek = require('hoek');
const Joi = require('joi');

exports = module.exports = (srv, options) => {

    if (options.Users) {
        Hoek.assert(options.Users.prototype instanceof exports.base && options.Users.name === 'Users', 'Must provide custom Users model extending form the user-boilerplate\'s base Users model');
        return options.Users;
    }

    return exports.base;
};

exports.base = class Users extends Model {

    static get tableName() {

        return 'users';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number(),
            email: Joi.string().email(),
            password: Joi.string().allow(null),
            firstName: Joi.string(),
            lastName: Joi.string(),
            resetToken: Joi.string().allow(null)
        });
    }
};
