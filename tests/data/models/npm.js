module.exports = function () { return new Npm(); };

var Npm = function () { };

Npm.prototype.all = function () {
    return harbor.db.run('npm');
};
