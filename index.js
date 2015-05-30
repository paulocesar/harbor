var helpers = require('./src/helpers')
    Database = require('./src/database'),
    Model = require('./src/model')
    Server = require('./src/server');

var harbor = GLOBAL.harbor = { };

// add helpers to global harbor
harbor.helpers = helpers;

module.exports = {
    startDatabase: function (config) {
        harbor.db = new Database(config.db);
        harbor.Model = Model;
        harbor.models = helpers.requireFiles(config.modelsPath);
    },

    start: function (config) {
        this.startDatabase(config);
        return Server(config);
    }
};
