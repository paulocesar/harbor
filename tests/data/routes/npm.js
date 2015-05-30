//helpers

var route = function (path, handler, method) {
    method = method || 'GET';
    return { method: method, path: path, config: { handler: handler } };
};


//controllers

var hello = function (request, reply) {
    reply.view("npm", { message: 'hello' });
};

var projects = function (request, reply) {
    harbor.models.npm().all().then(function (projects) {
        reply({ projects: projects });
    });
};

module.exports = [
    route('/', hello),
    route('/projects', projects)
];
