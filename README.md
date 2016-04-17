Node Cache Manager store for PouchDB
==================================
The PouchDB store for the Node Cache Manager Module found on [Github](https://github.com/BryanDonovan/node-cache-manager)
and [NPM](https://www.npmjs.com/package/cache-manager).

Status
------------
Currently the code is in *`beta`*. I am using it in an application that was origininally going to use the redis store. 
Incomplete:

1. Tests
2. Code clean up
3. examples on using remote server
4. examples on replication
5. examples of syncing

Installation
------------

```sh
npm install cache-manager-pouchdb --save
```

Usage examples
--------------

Here are examples that demonstrate how to implement the PouchDB cache store.


## Features

* Replication
* Syncing


## Single store example

```js
var cacheManager = require('cache-manager');
var pouchDBStore = require('cache-manager-pouchdb');

var pouchDBCache = cacheManager.caching({
    store: pouchDBStore,
    options: {
        path: './cache',
        ttl: 600
    }
});

var ttl = 60;
pouchDBCache.set('foo', 'bar', {ttl: ttl}, function(err) {
    if (err) { throw err; }
        
    pouchDBCache.get('foo', function(err, result) {
        console.log(result);
        // >> 'bar'
        pouchDBCache.del('foo', function(err) {});
    });
});
```


## Promises example

```js
pouchDBCache.wrap(key, function() {
    return somePromise(key);
})
.then(function(data) {
    console.log('Data:', data);
});
```

## More examples

For more examples please visit the [Overview](https://www.npmjs.com/package/cache-manager#overview)
and [Usage Examples](https://www.npmjs.com/package/cache-manager#usage-examples)
sections of the [Node Cache Manager module](https://www.npmjs.com/package/cache-manager)

## Tests
Tests need to be written.

```js
npm test
```

## Contribution

If you would like to contribute to the project, please fork it and send me a pull request to the `dev` branch.

## License

node-cache-manager-pouchdb is licensed under the MIT license.