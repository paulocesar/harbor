var server = require('../../src/server'),
    request = require('superagent'),
    assert = require('assert'),
    route = require('../data/controller');

var url = function (p) {
    p = p || '';
    return 'http://localhost:5105/' + p;
}

describe('Server', function () {

    before(function () {
        return server({ routes: [ route ] });
    });

    it('should create a server', function (done) {
        request
            .get(url())
            .end(function(err, res) {
                assert.equal(res.body.message, 'hello');
                done();
            });
    });

});
