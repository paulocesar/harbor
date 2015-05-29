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

// get array with loaded files
var requireFilesFromFolder = function (requirePath) {
    if (!requirePath) { return {}; }

    var required = {};

    _.each(fs.readdirSync(requirePath), function (file) {
        var f = file.replace('.js', '');
        //TODO ignore file excludeFiles.indexOf(f) == -1
        required[f] = require(path.resolve(requirePath, file));
    });

    return required;
};

// create server method
module.exports = function (data) {

    //HAPI server creation step
    var hapiCfg = {};
    server = new Hapi.Server(hapiCfg);

    //start load routes and configs
    var register = Q.denodeify(_.bind(server.register, server)),
        start = Q.denodeify(_.bind(server.start, server)),
        routes = requireFilesFromFolder(data.routesPath),
        models = requireFilesFromFolder(data.modelsPath),
        config = data.config || {},
        db = new Database(config.db);

    // set all global variables for server
    // TODO: should we keep it here?
    var harbor = GLOBAL.harbor = { db: db, models: {} };

    server.connection({ port: config.server.port || 5105 });

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

        //models must export model name
        _.each(models, function (m, name) { harbor.models[name] = m; });

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
