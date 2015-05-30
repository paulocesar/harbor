var util = require('util');

module.exports = function () { return new Npm(); };

var Npm = function () {
    harbor.Model.apply(this, arguments);
};

util.inherits(Npm, harbor.Model);

Npm.prototype.all = function () {
    return this.db('npm');
};
