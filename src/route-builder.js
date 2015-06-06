var _ = require('lodash');

var RouteBuilder = function () {
    this.route = {};
};

module.exports = RouteBuilder;

var createRoute = function (method, path, handler) {
    return {
        method: method.toUpperCase(),
        path: path,
        config: { handler: handler }
    };
};

_.extend(RouteBuilder.prototype, {
    done: function () {
        return this.route;
    },

    decorate: function (data) {
        _.merge(this.route, data);
        return this;
    },

    get: function (path, handler) {
        return this.decorate(createRoute('get', path, handler));
    },

    post: function (path, handler) {
        return this.decorate(createRoute('post', path, handler));
    },

    put: function (path, handler) {
        return this.decorate(createRoute('put', path, handler));
    },

    delete: function (path, handler) {
        return this.decorate(createRoute('delete', path, handler));
    },

    session: function () {
        return this.decorate({ config: { auth: 'session' }});
    },

    login: function () {
        return this.decorate({config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }});
    }
});
