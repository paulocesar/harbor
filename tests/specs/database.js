var assert = require('assert'),
    config = require('../config.js'),
    database = require('../../src/database'),
    db = database(config);

describe('Database', function () {

    it('connect to database', function () {
        return db('npm').select('name').then(function (projects) {
            assert.equal(projects.length, 2);
        });
    });

    it('should get first object', function () {
        return db('npm').then(db.firstRow).then(function (project) {
            assert.equal(typeof project.name, "string");
        });
    });
});
