var Model = function () {
}

Model.prototype.db = function (tableName) {
    return harbor.db.run(tableName);
}
