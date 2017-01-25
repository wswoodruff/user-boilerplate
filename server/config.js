'use strict';

let Creds = {};
try {
    Creds = require('./credentials');
}
catch (ignoreException){
    Creds = require('./credentials-sample');
}

module.exports = {

    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000
    },

    main: {
        connection: process.env.NODE_ENV === 'test' ? 'disk' : 'mysql',
        secrets: {
            jwtSecret: Creds.secrets.jwtSecret
        }
    },

    schwifty: {
        knex: require('./knexconfig')[process.env.NODE_ENV]
    },

    schwiftyMigration: {
        migrationsDir: __dirname
    }
};
