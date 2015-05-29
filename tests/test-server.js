var path = require('path'),
    server = require('../index'),
    config = require('./config');

server({
    config: config,
    cookiePassword: 'sample',
    redirectLogin: '/login',
    routesPath: path.resolve(__dirname, "data", "routes"),
    modelsPath: path.resolve(__dirname, "data", "models"),
    publicPath: path.resolve(__dirname, "data")
}).then(function () {
    console.log("Running test server...");
});
