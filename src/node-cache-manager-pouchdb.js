/* global module, Promise, process */

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

var pouchDBStore = function (args) {
    var ttl_default = args.ttl || 60;
    var db = new PouchDB(args.path || './cache');
    var self = {
        name: 'pouchdb'
    };

    self.isCacheableValue = function (value) {
        return value !== null && value !== undefined;
    };

    self.set = function (key, value, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};
        var ttl = (options.ttl || options.ttl === 0) ? options.ttl : ttl_default;

        var data = {
            key: key,
            value: value,
            expires: Date.now() + (ttl * 1000)
        };

        if (cb) {
            process.nextTick(function () {
                db.upsert(key, function (doc) {
                    doc.data = data;
                    return doc;
                }, function(err, doc){
                    if(err){
                        cb(err);
                    } else {
                        cb(null, data);
                    }
                });
            });
        } else {
            return db.upsert(key, function (doc) {
                doc.data = data;
                return doc;
            }).then(function(){
                return data;
            });
        }
    };

    self.get = function (key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};

        if (cb) {
            process.nextTick(function () {
                db.get(key, function (err, doc) {
                    if (err && err.status !== 404) {
                        cb(err);
                    } else if (!doc || doc.data.expires < Date.now() || (err && err.status === 404)) {
                        cb();
                    } else {
                        cb(null, doc.data.value);
                    }
                });
            });
        } else {
            return db.get(key).then(function (doc) {
                if (!doc || doc.data.expires < Date.now()) {
                    return;
                } else {
                    return doc.data.value;
                }
            }).catch(function(err){
                if(err.status === 404){
                    return null;
                } else {
                    throw err;
                }
            })
        }
    };
    self.del = function (key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
        }

        if (cb) {
            process.nextTick(function () {
                db.get(key, function (err, doc) {
                    if (err) {
                        cb(err);
                    } else {
                        db.remove(doc, cb);
                    }
                });
            });
        } else {
            return db.get(key).then(function (doc) {
                return db.remove(doc);
            });
        }
    };
    self.reset = function (cb) {
        if (cb) {
            process.nextTick(function () {
                db.destroy(cb);
            });
        } else {
            return db.destroy();
        }
    };
    self.keys = function (cb) {
        if (cb) {
            process.nextTick(function () {
                db.allDocs(function (err, response) {
                    if (err) {
                        cb(err);
                    } else {
                        var keys = response.rows.map(function (row) {
                            return row.id;
                        });
                        cb(null, keys);
                    }
                });
            });
        } else {
            return db.allDocs().then(function (response) {
                return response.rows.map(function (row) {
                    return row.id;
                });
            });
        }
    };
    return self;
};

module.exports = {
    create: function (args) {
        return pouchDBStore(args);
    }
};