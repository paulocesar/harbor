var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    Hapi = require('hapi'),
    AuthBasic = require('hapi-auth-basic'),
    Database = require('./database'),
    server = null;

// TODO: create a method to validate login
var defaultValidate = function (username, password, callback) {

};

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
    if (!requirePath) { return []; }

    var required = [];

    _.each(fs.readdirSync(requirePath), function (file) {
        var f = file.replace('.js', '');
        //TODO ignore file excludeFiles.indexOf(f) == -1
        required.push(require(path.resolve(requirePath, file)));
    });

    return required;
};

// create server method
// TODO: add public folder from config file
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
        validate = data.validate || defaultValidate;
        db = new Database(config.db);

    // set all global variables for server
    // TODO: should we keep it here?
    var harbor = GLOBAL.harbor = { db: db, models: {} };

    server.connection({ port: config.server.port || 5105 });

    // register hapi plugins and create routes
    return register(AuthBasic)
        .then(function () {

            //TODO: think about add other auth strategies
            server.auth.strategy('basic', 'basic', { validateFunc: validate });

            //routes are equal Hapi structure
            _.each(routes, function (r) { server.route(r); });

            //models must export model name
            _.each(models, function (m) { _.extend(harbor.models, m); });

            if (data.publicPath) {
                addPublicPath(server, data.publicPath)
            }

            harbor.hapi = server;

            return start().done();
        });
};
