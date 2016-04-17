/* global require */

var exec = require('child_process').exec;
var db_dir = './cache';
var expect = require('chai').expect;

var cacheManager = require('cache-manager');
var pouchdbStore = require('../index');
var cache_path = './cache';
var pouchdbCache = cacheManager.caching({
    store: pouchdbStore,
    path: cache_path,
    ttl: 10
});

describe('The PouchDb Cache Manager', function () {
    
    after(function (done) {
        exec('rm -r ' + db_dir, function (err, stdout, stderr) {
            done(err, stdout);
        });
    });
});