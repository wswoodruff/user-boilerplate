'use strict';

const Model = require('schwifty').Model;
const Hoek = require('hoek');
const Joi = require('joi');
const Schwifty = require('schwifty');

exports = module.exports = (srv, options) => {

    if (options.Users) {
        Schwifty.assertCompatible(options.Users, exports.base, 'Must provide custom Users model extending form the user-boilerplate\'s base Users model');
        return options.Users;
    }

    return exports.base;
};

exports.base = class Users extends Model {

    static get tableName() {

        return 'Users';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number(),
            email: Joi.string().email(),
            password: Joi.string().allow(null),
            name: Joi.string(),
            resetToken: Joi.string().allow(null),
            acl: Joi.object({
                group: Joi.string()
            }),
            serverFingerprint: Joi.string()
        });
    }
};
