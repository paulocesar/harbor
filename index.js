var helpers = require('./src/helpers'),
    RouteBuilder = require('./src/route-builder'),
    Database = require('./src/database'),
    Model = require('./src/model')
    Server = require('./src/server');

var harbor = GLOBAL.harbor = { };

// add helpers to global harbor
harbor.helpers = helpers;

harbor.route = function () {
    return new RouteBuilder();
};

module.exports = {
    startDatabase: function (config) {
        harbor.db = new Database(config.db);
        harbor.Model = Model;

        if (!config.modelsPath) { return; }

        harbor.models = helpers.requireFiles(config.modelsPath);
    },

    start: function (config) {
        this.startDatabase(config);
        return Server(config);
    }
};
