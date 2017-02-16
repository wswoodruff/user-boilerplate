'use strict';

// Load modules

const Lab = require('lab');
const Code = require('code');
const Items = require('items');

const LabbableServer = require('../server');

// Test shortcuts

const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.describe;
const expect = Code.expect;
const it = lab.it;

let jwt = '';

describe('User Boilerplate API server', () => {

    let server;

    before((done) => {

        LabbableServer.ready((err, srv) => {

            if (err) {
                return done(err);
            }

            server = srv;
            //set up schema for tests to operate on
            const tables = [
                {
                    tableName: 'users',
                    columns: [
                        {
                            name: 'id',
                            type: 'integer',
                            primary: 'true'
                        },
                        {
                            name: 'dogId',
                            type: 'integer'
                        },
                        {
                            name: 'email',
                            type: 'string'
                        },
                        {
                            name: 'password',
                            type: 'string'
                        },
                        {
                            name: 'firstName',
                            type: 'string'
                        },
                        {
                            name: 'lastName',
                            type: 'string'
                        },
                        {
                            name: 'resetToken',
                            type: 'string'
                        }
                    ]
                },
                {
                    tableName: 'tokens',
                    columns: [
                        {
                            name: 'id',
                            type: 'string'
                        },
                        {
                            name: 'user',
                            type: 'integer'
                        }
                    ]
                },
                {
                    tableName: 'dogs',
                    columns: [
                        {
                            name: 'id',
                            type: 'integer',
                            primary: 'true'
                        },
                        {
                            name: 'name',
                            type: 'string'
                        }
                    ]
                }
            ];

            const knex = server.knex();

            Items.parallel(tables, (knexTable, next) => {

                knex.schema.createTableIfNotExists(knexTable.tableName, (table) => {

                    Items.parallel(knexTable.columns, (column, columnNext) => {

                        if (column.primary === 'true'){
                            table[column.type](column.name).primary();
                        }
                        else {
                            table[column.type](column.name);
                        }
                        columnNext();
                    }, (columnErr) => {

                        expect(columnErr).to.not.exist();
                    });
                }).then(next);
            }, (err) => {

                //coming out of knex promise should be empty array instead of undef
                expect(err).to.equal([]);

                const Dogs = server.models(true).Dogs;

                return Dogs.query().insert({ name: 'Guinness' }).asCallback(done);
            });
        });
    });

    describe('Users route', () => {

        it('Can create a User', (done) => {

            const options = {
                method: 'POST',
                url: '/users',
                payload: {
                    email: 'test@test.com',
                    password: 'password',
                    firstName: 'Test',
                    lastName: 'Test',
                    dogId: 1
                }
            };

            server.inject(options, (response) => {

                const result = response.result;

                expect(response.statusCode).to.equal(200);
                expect(result).to.be.an.object();
                expect(result.email).to.equal('test@test.com');
                done();
            });
        });

        it('Can Log In', (done) => {

            const options = {
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'test@test.com',
                    password: 'password'
                }
            };

            server.inject(options, (response) => {

                const result = response.result;

                expect(response.statusCode).to.equal(200);
                expect(result).to.be.an.string();
                jwt = result;
                done();
            });
        });

        it('Can fetch all users', (done) => {

            const options = {
                method: 'GET',
                url: '/users',
                headers : {
                    'Authorization' : jwt,
                    'Content-Type' : 'application/json; charset=utf-8'
                }
            };

            server.inject(options, (response) => {

                const result = response.result;
                expect(response.statusCode).to.equal(200);
                expect(result).to.be.an.array();

                done();
            });
        });

        it('Can fetch a user', (done) => {

            const options = {
                method: 'GET',
                url: '/user',
                headers : {
                    'Authorization' : jwt,
                    'Content-Type' : 'application/json; charset=utf-8'
                }
            };

            server.inject(options, (response) => {

                const result = response.result;

                expect(response.statusCode).to.equal(200);
                expect(result).to.be.an.object();
                expect(result.email).to.equal('test@test.com');

                done();
            });
        });

        it('Can fetch a user\'s dogs.', (done) => {

            const options = {
                method: 'get',
                url: '/users',
                headers : {
                    'authorization' : jwt,
                    'content-type' : 'application/json; charset=utf-8'
                }
            };

            server.inject(options, (res1) => {

                const userId = res1.result[0].id;

                server.inject({
                    method: 'get',
                    url: `/users/${userId}/dog`
                }, (res2) => {

                    expect(res2.result).to.contain({ name: 'Guinness' });
                    done();
                });
            });
        });

        it('Can delete a user', (done) => {

            const options = {
                method: 'GET',
                url: '/users',
                headers : {
                    'Authorization' : jwt,
                    'Content-Type' : 'application/json; charset=utf-8'
                }
            };

            server.inject(options, (response) => {

                const userId = response.result[0].id;
                const delOptions = {
                    method: 'DELETE',
                    url: '/users/' + userId,
                    headers : {
                        'Authorization' : jwt,
                        'Content-Type' : 'application/json; charset=utf-8'
                    }
                };

                server.inject(delOptions, (delResponse) => {

                    expect(delResponse.statusCode).to.equal(204);
                    done();
                });
            });
        });
    });
});
