'use strict';

const Joi = require('joi');
const Model = require('schwifty').Model;
const BaseUsers = require('../../lib').Users;

module.exports = class Users extends BaseUsers {

    static get joiSchema() {

        return super.joiSchema.keys({
            dogId: Joi.number().integer(),
            favoriteFood: Joi.string().allow(null)
        });
    }

    static get relationMappings() {

        return {
            dog: {
                relation: Model.HasOneRelation,
                modelClass: require('./dogs'),
                join: {
                    from: 'users.dogId',
                    to: 'dogs.id'
                }
            }
        };
    }
};
