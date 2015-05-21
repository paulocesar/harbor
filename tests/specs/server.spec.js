var server = require('../../index'),
    path = require('path'),
    request = require('superagent'),
    assert = require('assert'),
    config = require('../config');

var url = function (p) {
    p = p || '';
    return 'http://localhost:5105/' + p;
}

describe('Server', function () {

    before(function () {
        return server({
            config: config,
            routesPath: path.resolve(__dirname, "..", "data", "routes"),
            modelsPath: path.resolve(__dirname, "..", "data", "models"),
            publicPath: path.resolve(__dirname, "..", "data")
        });
    });

    it('should create a server', function (done) {
        assert.equal(typeof harbor.db, 'object');
        assert.equal(typeof harbor.models.npm, 'object');

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
