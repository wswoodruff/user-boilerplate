'use strict';

const Uuid = require('uuid/v4');
const Joi = require('joi');
const Model = require('schwifty').Model;

module.exports = (srv) => {

    return class Tokens extends Model {

        static get tableName() {

            return 'tokens';
        }

        static get joiSchema() {

            return Joi.object({

                user: Joi.any(),
                id: Joi.string().uuid().default(() => {

                    return Uuid({
                        rng: Uuid.nodeRNG
                    });
                }, 'Uuid')
            });
        }

        static get relationMappings() {

            return {
                users: {
                    relation: Model.BelongsToOneRelation,
                    modelClass: srv.models().Users,
                    join: {
                        from: 'users.id',
                        to: 'tokens.user'
                    }
                }
            };
        }
    };
};
