var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    Hapi = require('hapi'),
    Database = require('./database'),
    AuthCookie = require('hapi-auth-cookie'),
    server = null;

// set public folder to hapi
var addPublicPath = function (server, publicPath) {
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {directory: { path: publicPath, listing: true }}
    });
}

// create server method
module.exports = function (data) {

    //HAPI server creation step
    var hapiCfg = {};
    server = new Hapi.Server(hapiCfg);

    //start load routes and configs
    var harbor = GLOBAL.harbor,
        register = Q.denodeify(_.bind(server.register, server)),
        start = Q.denodeify(_.bind(server.start, server)),
        routes = harbor.helpers.requireFiles(data.routesPath);

    server.connection({ port: data.port || 5105 });

    // register hapi plugins and create routes
    return register(AuthCookie).then(function () {
        server.auth.strategy('session', 'cookie', {
            cookie: 'session',
            password: data.cookiePassword || 'harboria#&733b',
            redirectTo: data.redirectLogin || '/login',
            isSecure: false,
            ttl: 24* 60 * 60 * 1000
        });

        //routes are equal Hapi structure
        _.each(routes, function (r) { server.route(r); });

        if (data.publicPath) {
            addPublicPath(server, data.publicPath);
        }

        harbor.hapi = server;

        return start();
    })
    .then(function () {
        return harbor;
    })
    .catch(function (err) {
        console.log(err);
    });
};
