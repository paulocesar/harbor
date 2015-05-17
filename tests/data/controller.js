var hello = function (request, reply) {
    reply({ message: 'hello' });
};

var projects = function (request, reply) {
    harbor.db.run('npm').then(function (projects) {
        reply({ projects: projects });
    });
};

var route = function (path, handler, method) {
    method = method || 'GET';
    return { method: method, path: path, config: { handler: handler } };
};

module.exports = [
    route('/', hello),
    route('/projects', projects)
]
