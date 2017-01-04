'use strict';

const Joi = require('joi');
const Model = require('schwifty').Model;

module.exports = (srv, options) => {

    return class Users extends Model {

        static get tableName() {

            return 'Users';
        }

        /*
            Runs for each instance of User.
            A User class instance is created when a row is grabbed from the DB
        */
        $afterGet(queryContext) {

            // Setting to undefined is faster than `delete` on V8 engine
            if (!queryContext.showPassword) {
                this.password = undefined;
            }
        }

        static get schema() {

            return Joi.object({

                // email: Joi.string().email().required(), // .unique() needs to be specified in the migration file
                // password: Joi.string().required(),
                // firstName: Joi.string().required(),
                // lastName: Joi.string().required(),
                // resetToken: Joi.string()
                id: Joi.number(),
                email: Joi.string().email(), // .unique() needs to be specified in the migration file
                password: Joi.string().allow(null),
                firstName: Joi.string(),
                lastName: Joi.string(),
                resetToken: Joi.string().allow(null)
            });
        }
    };
};
