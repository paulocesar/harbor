var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    Hapi = require('hapi'),
    Database = require('./database'),
    AuthCookie = require('hapi-auth-cookie'),
    server = null;

var configureAuthStrategy = function (server, data) {
    server.auth.strategy('session', 'cookie', {
        cookie: 'session',
        password: data.cookiePassword || 'harboria#&733b',
        redirectTo: data.redirectLogin || '/login',
        isSecure: false,
        ttl: 24* 60 * 60 * 1000
    });
};

var loadRoutes = function (server, data) {
    var routes = harbor.helpers.requireFiles(data.routesPath);

    //routes are equal Hapi structure
    _.each(routes, function (r) { server.route(r); });
};

var addPublicPath = function (server, data) {
    if (!data.publicPath) { return; }

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: { directory: {
            path: data.publicPath, listing: true
        }}
    });
};

// create server method
module.exports = function (data) {
    var harbor = GLOBAL.harbor,
        hapiCfg = {},
        server = new Hapi.Server(hapiCfg),
        register = Q.denodeify(_.bind(server.register, server)),
        start = Q.denodeify(_.bind(server.start, server));

    // set server to global access
    harbor.hapi = server;

    server.connection({ port: data.port || 5105 });

    return register(AuthCookie).then(function () {
        configureAuthStrategy(server, data);
        loadRoutes(server, data);
        addPublicPath(server, data);

        return start();
    })
    .then(function () {
        return harbor;
    })
    .catch(function (err) {
        console.log(err);
    });
};
