var _ = require('lodash'),
    Q = require('q'),
    Hapi = require('hapi'),
    AuthBasic = require('hapi-auth-basic'),
    server = new Hapi.Server();

server.connection({ port: 5105 });

module.exports = function (config) {
    config = config || {};

    var register = Q.denodeify(_.bind(server.register, server)),
        start = Q.denodeify(_.bind(server.start, server)),
        routes = config.routes || [];

    return register(AuthBasic)
        .then(function () {
            _.each(routes, function (r) { server.route(r); });
            return start();
        })
};
