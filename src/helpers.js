var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    helpers = null;

module.exports = helpers = {};

// load files from a specific folder
// please try to always use path.resolve
helpers.requireFiles = function (requirePath) {
    if (!requirePath) { return {}; }

    var required = {};

    _.each(fs.readdirSync(requirePath), function (file) {
        var f = file.replace('.js', '');
        // TODO: ignore file excludeFiles.indexOf(f) == -1
        required[f] = require(path.resolve(requirePath, file));
    });

    return required;
};
