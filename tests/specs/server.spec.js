var server = require('../../src/server'),
    path = require('path'),
    request = require('superagent'),
    assert = require('assert'),
    route = require('../data/route'),
    config = require('../config');

var url = function (p) {
    p = p || '';
    return 'http://localhost:5105/' + p;
}

describe('Server', function () {

    before(function () {
        return server({
            routes: [ route ],
            config: config,
            routesPath: path.resolve(__dirname, "..", "data", "controllers"),
            modelsPath: path.resolve(__dirname, "..", "data", "models"),
            publicPath: path.resolve(__dirname, "..", "data")
        });
    });

    it('should create a server', function (done) {
        request
            .get(url())
            .end(function (err, res) {
                assert.equal(res.body.message, 'hello');
                done();
            });
    });

    it('should select items form database', function (done) {
        request
            .get(url('projects'))
            .end(function (err, res) {
                assert.equal(res.body.projects.length, 2);
                done();
            });
    });

    it('should get a pubic file', function (done) {
        request
          .get(url('test.sql'))
          .end(function (err, res) {
            if (err) { return done(err); }
            done();
          });
    });

});
