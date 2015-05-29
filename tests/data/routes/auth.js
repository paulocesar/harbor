//TODO: see example in https://github.com/hapijs/hapi-auth-cookie

var users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

var loginRoute = {
    method: 'POST',
    path: '/login',
    config: {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        plugins: {
            'hapi-auth-cookie': {
                redirectTo: false
            }
        },
        handler: function (request, reply) {
            if (request.auth.isAuthenticated) {
                return reply.redirect('/home');
            }

            var message = '';
            var account = null;

            if (!request.payload.id || !request.payload.password) {
                message = 'Missing username or password';
            }
            else {
                account = users[request.payload.id];
                if (!account || account.password !== request.payload.password) {
                    message = 'Invalid username or password';
                }
            }

            if (message) { return reply({ message: message }); }

            request.auth.session.set(account);
            return reply(account);
        }
    }
};


var logoutRoute = {
    method: 'GET',
    path: '/logout',
    config: {
        auth: 'session',
        handler: function (request, reply) {
            request.auth.session.clear();
            return reply.redirect('/');
        }
    }
};

var homeRoute = {
    method: 'GET',
    path: '/home',
    config: {
        auth: 'session',
        handler: function (request, reply) {
            return reply(request.auth.credentials);
        }
    }
};


module.exports = [
    homeRoute,
    loginRoute,
    logoutRoute
];
