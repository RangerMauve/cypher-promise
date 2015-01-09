cypher-promise
==============

A wrapper over node-cypher which is promise-based. This uses [any-promise](https://www.npmjs.com/package/any-promise) so you're expected to install a promise library that's compatible.

```
    npm install --save cypher-promise
```

Example
-------

```javascript
// Require the module
var cypher = require("./");
var Promise = require("any-promise");

// Connect to a DB
var client = cypher("http://localhost:7474");

// Make a query
client.query("MATCH (n:Person) RETURN count(n)").then(log, err);

// Make batch queries
var multi = client.multi();

// This will let us easily build a bunch of queries to execute
var queries = [];
var index = 10;
var multi_query = "CREATE (n:Person{index:{index}}) RETURN count(n)";

while (index--) {
  // Build up the array of promises from the queries
  queries.push(multi.query(multi_query, {
    index: index
  }));
}

// Execute the batch
multi.exec().then(log.bind(null, "Multi executed"));

// Once all the promises resolve
Promise.all(queries).then(log, err);

function log(data) {
  console.log(data);
}

function err(data) {
  console.error("Error", data);
}
```

API
---

### `Cypher([connection_url],[connection_opts])`\`

This creates a new cypher `Client` for making queries.

#### arguments

-	[connection_url] {String}: This is the connection URL. If it is omitted,`http://localhost:7474` is used instead.
-	[connection_opts] {Object}: Please see the [node-cypher docs](https://github.com/objectundefined/node-cypher#createclientconnectionoptions-clientoptions-callback-) for what this should contain. It's an empty object by default.

### returns

A new instance of `Client`

### `Client.query(cypher_text,[parameters])`

Sends a new query and resolves to the result

#### arguments

-	cypher_text {String} A query written in Cypher to send to Neo4j
-	[parameters] {Object} Optional parameters to pass into the query. It's an empty object if not specified.

### returns

-	A `Promise` which resolves to the result of the query.

### `Client.multi()`

Creates a new `Batch` for making multiple queries to the server in one request.

#### returns

A new `Batch` instance

### `Batch.query(cypher_text,[parameters])`

Exact same API as `Client.query`, but it doesn't evaluate until you execute the batch

### `Batch.exec()`

This executes the batch and triggers all the query promises to resolve on success.

#### returns

A `Promise` which rejects if there was something wrong during the batch query.

Thanks
------

Special thanks to [Gabriel Lipson](https://github.com/objectundefined) for making [node-cypher](https://github.com/objectundefined/node-cypher).

License
-------

The MIT License (MIT)

Copyright (c) 2015 RangerMauve

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
