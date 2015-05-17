var assert = require('assert'),
    config = require('../config.js'),
    Database = require('../../src/database'),
    db = new Database(config.db);

describe('Database', function () {

    it('connect to database', function () {
        return db.run('information_schema.columns')
            .select('table_name', 'column_name')
            .where('table_schema', config.db.connection.database)
            .then(function (tables) {
                console.log(tables);
            });
    });

    it('get first object', function () {
        return db.run('npm')
            .then(db.tryOneRow)
            .then(function (project) {
                assert.equal(typeof project.name, "string");
            });
    });

    it('create active record', function () {
        return db.run('npm')
            .limit(1)
            .then(db.activeRecord('npm'))
            .then(function (project) {
                assert.equal(typeof project.name, "string");
            });
    });
});
