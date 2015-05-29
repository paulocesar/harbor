var _ = require('lodash'),
    Q = require('q'),
    knex = require('knex');

//create a database with knex
var database = function (config) {
    var db = this;

    db.run = knex(config);

    // handler mysql disconnections that is not supported
    // by node-mysql library. probably will be fixed in
    // the future
    var reconnectHandler = function (conn) {
        conn.on('error', function(err) {
            console.log('\nRe-connecting lost connection: ' +err.stack);
            db.run.destroy();
            db.run = knex(config);
        });
        return conn;
    }

    //add reconnect handler to mysql
    //BUG: we're missing promise here, see another way to do it
    db.run.client
        .acquireRawConnection()
        .then(reconnectHandler)
        .catch(function (err) {
            console.log(err);
        });
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

module.exports = database;
