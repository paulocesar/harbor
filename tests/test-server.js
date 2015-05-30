var path = require('path'),
    server = require('../index'),
    config = require('./config');

server.start({
    db: config.db,
    port: config.server.port,
    cookiePassword: 'sample',
    redirectLogin: '/login',
    routesPath: path.resolve(__dirname, "data", "routes"),
    modelsPath: path.resolve(__dirname, "data", "models"),
    viewsPath: path.resolve(__dirname, "data", "views"),
    publicPath: path.resolve(__dirname, "data")
}).then(function () {
    console.log("Running test server...");
});
