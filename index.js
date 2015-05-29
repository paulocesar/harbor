var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    Database = require('./src/database'),
    server = require('./src/server');

var harbor = GLOBAL.harbor = {
    helpers: { }
};

// get array with loaded files
harbor.helpers.requireFilesFromFolder = function (requirePath) {
    if (!requirePath) { return {}; }

    var required = {};

    _.each(fs.readdirSync(requirePath), function (file) {
        var f = file.replace('.js', '');
        //TODO ignore file excludeFiles.indexOf(f) == -1
        required[f] = require(path.resolve(requirePath, file));
    });

    return required;
};

module.exports = {
    startDatabase: function (config) {
        harbor.db = new Database(config.db);
    },

    startModels: function (config) {
        harbor.models = harbor
            .helpers
            .requireFilesFromFolder(config.modelsPath);
    },

    start: function (config) {
        this.startDatabase(config);
        this.startModels(config);
        return server(config);
    }
};
