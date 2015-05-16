var _ = require('lodash'),
    Q = require('q'),
    knex = require('knex');

handlers = {};

handlers.firstRow = function (results) { return results[0]; };

module.exports = function (config) {
    var database = knex(config);

    _.extend(database, handlers)

    return database;
};
