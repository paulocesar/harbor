var _ = require('lodash'),
    Q = require('q'),
    Hapi = require('hapi'),
    AuthBasic = require('hapi-auth-basic'),
    server = new Hapi.Server(),
    Database = require('./database');

// TODO: create a method to validate login
var defaultValidate = function (username, password, callback) {

};

// create server method
// TODO: add public folder from config file
module.exports = function (data) {
    var register = Q.denodeify(_.bind(server.register, server)),
        start = Q.denodeify(_.bind(server.start, server)),
        routes = data.routes || [],
        config = data.config || {},
        validate = data.validate || defaultValidate;
        db = new Database(config.db);

    // set all global variables for server
    // TODO: should we keep it here?
    var harbor = GLOBAL.harbor = { db: db };

    server.connection({ port: config.server.port || 5105 });

    // register hapi plugins and create routes
    return register(AuthBasic)
        .then(function () {

            //TODO: think about add other auth strategies
            server.auth.strategy('basic', 'basic', { validateFunc: validate });

            _.each(routes, function (r) { server.route(r); });

            harbor.hapi = server;

            return start().done();
        });
};
