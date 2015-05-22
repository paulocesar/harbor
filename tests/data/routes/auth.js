//helpers

var route = function (path, handler, method) {
    method = method || 'GET';
    return { method: method, path: path, config: { handler: handler } };
};


//controllers

//TODO: see example in https://github.com/hapijs/hapi-auth-cookie

var login = function (request, reply) {
    reply({ message: 'hello' });
};

var logout = function (request, reply) {
    harbor.db.run('npm').then(function (projects) {
        reply({ projects: projects });
    });
};

module.exports = [
    route('/login', login),
    route('/logout', logout)
];
