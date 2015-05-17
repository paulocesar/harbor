var _ = require('lodash'),
    Q = require('q'),
    knex = require('knex');

//create a database with knex
database = function (config) {
    this.run = knex(config);
};


//helpers that doesn't exists in knex

database.prototype.tryOneRow = function (results) {
    return results[0];
};

database.prototype.oneRow = function (results) {
    if (_.isEmpty(results) || results.length != 1) {
        throw new Error('must find only one line');
    }

    return results[0];
};

// TODO: think about this activeRecord
// we really need it? this is the right place?
database.prototype.activeRecord = function (tableName) {
    var self = this;

    return function (results) {
        var data = self.oneRow(results);
        return results[0];
    }
};


module.exports = database;
