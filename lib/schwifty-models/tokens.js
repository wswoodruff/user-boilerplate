'use strict';

const Joi = require('joi');
const Uuid = require('node-uuid');
const Model = require('schwifty').Model;

module.exports = (srv, options) => {

    return class Tokens extends Model {

        static get tableName() {

            return 'Tokens';
        }

        static get schema() {

            return Joi.object({
                user: Joi.any(),
                uuid: Joi.string().uuid().default(() => {

                    return Uuid.v4({
                        rng: Uuid.nodeRNG
                    });
                }, 'Uuid')
            });
        }

        static get relationMappings() {

            return {
                user: {
                    relation: Model.BelongsToOneRelation,
                    modelClass: require('./users')(),
                    join: {
                        from: 'Users.id',
                        to: 'Tokens.user'
                    }
                }
            };
        }
    };
};
