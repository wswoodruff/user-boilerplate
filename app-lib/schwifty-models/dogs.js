'use strict';

const Joi = require('joi');
const Model = require('schwifty').Model;

module.exports = class Dogs extends Model {

    static get tableName() {

        return 'dogs';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number(),
            name: Joi.string().required()
        });
    }

    static get relationMappings() {

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: require('./users'),
                join: {
                    from: 'users.dogId',
                    to: 'dogs.id'
                }
            }
        };
    }
};
