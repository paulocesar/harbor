var _ = require('lodash'),
    Q = require('q'),
    knex = require('knex');

database = function (config) {
    this.run = knex(config);
};

database.prototype.tryOneRow = function (results) {
    return results[0];
};

database.prototype.oneRow = function (results) {
    if (_.isEmpty(results) || results.length != 1) {
        throw new Error('must find only one line');
    }

    return results[0];
};

database.prototype.activeRecord = function (tableName) {
    var self = this;

    return function (results) {
        var data = self.oneRow(results);
        return results[0];
    }
};

module.exports = database;
