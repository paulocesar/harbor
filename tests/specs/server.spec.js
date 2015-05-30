var server = require('../../index'),
    path = require('path'),
    request = require('superagent'),
    assert = require('assert'),
    config = require('../config');

var url = function (p) { return 'http://localhost:5105/' + (p || ''); };

var htmlResponse = "<p>hello</p>\n";

describe('Server', function () {

    before(function () {
        return server.start({
            db: config.db,
            port: config.port,
            cookiePassword: 'sample',
            redirectLogin: '/login',
            routesPath: path.resolve(__dirname, "..", "data", "routes"),
            modelsPath: path.resolve(__dirname, "..", "data", "models"),
            viewsPath: path.resolve(__dirname, "..", "data", "views"),
            publicPath: path.resolve(__dirname, "..", "data")
        }).then(function (harbor) {
            assert.equal(typeof harbor.db, 'object')
        });
    });

    it('should create complete a server', function (done) {
        assert.equal(typeof harbor.db, 'object');
        assert.equal(typeof harbor.models.npm, 'function');

        request.get(url())
            .end(function (err, res) {
                assert.equal(res.text, htmlResponse);
                done();
            });
    });

    it('should select items form database', function (done) {
        request.get(url('projects'))
            .end(function (err, res) {
                assert.equal(res.body.projects.length, 2);
                done();
            });
    });

    it('should get a pubic file', function (done) {
        request.get(url('test.sql'))
          .end(function (err, res) {
            if (err) { return done(err); }
            done();
          });
    });

    it('should login', function (done) {
        var r = request.agent();

        var testSession = function (callback) {
            r.get(url('home')).end(function(err, res) {
                assert.equal(res.body.id, 'john');
                callback();
            });
        }

        var testLogout = function () {
            r.get(url('logout')).end(function(err, res) {
                assert.equal(res.text, htmlResponse);
                done();
            });
        };

        r.post(url('login'))
            .send({ id: 'john', password: 'password' })
            .end(function (err, res) {
                assert(res.body.id, 'john');
                testSession(testLogout);
            })
    });

    it('should load models', function (done) {
        harbor.models.npm().all().then(function (projects) {
            assert.equal(projects.length, 2);
            done();
        });
    });

});
