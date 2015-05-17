
var hello = function (request, reply) {
    reply({ message: 'hello' });
}

module.exports = [
    { method: 'GET', path: '/', config: { handler: hello } }
]
