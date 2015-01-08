var Promise = require("any-promise");
var cypher = require("node-cypher");
var par = require("par");
var rpar = par.rpartial;

module.exports = make_query_maker;

/**
 * Creates a new client for making cypher queries
 * @param  {String}  connection_string The url of the Neo4j server
 * @param  {Object}  [connection_opts] Options for node-cypher
 * @return {Cypher}                    Returns a new Cypher client
 */
function make_query_maker(connection_string, connection_opts) {
	connection_string = connection_string || "http://localhost:7474"
	connection_opts = connection_opts || {};
	var client_cache = null;

	return {
		query: query,
		multi: multi
	};

	/**
	 * Makes a cypher query and resolves to the result
	 * @param  {String}  cypher_query The CQL code to execute
	 * @param  {Object}  [parameters] The parameters to pass to the query
	 * @return {Promise}              Resolves to the result of the query
	 */
	function query(cypher_query, parameters) {
		return get_client()
			.then(rpar(query_with, cypher_query, parameters));
	}

	/**
	 * Make a new object for batching queries. Call multi.query multiple times,
	 * and then call multi.exec() to get a promise of whether everything succeeded
	 * or not.
	 * @return {Multi} Returns a multi object with `query` and `exec` methods
	 */
	function multi() {
		return get_client().then(function(client) {
			var multi_batch = client.multi();
			return {
				query: par(query_with, multi_batch),
				exec: make_promise(multi_batch.exec.bind(multi_batch))
			};
		});
	}

	// Makes a query with a given client and returns a promise
	function query_with(client, cypher_query, parameters) {
		parameters = parameters || {};
		return make_promise(client.query.bind(client, cypher_query, parameters));
	}

	// Creates a new client or returns a cached one
	function get_client() {
		if (client_cache) return Promise.resolve(client);
		return make_promise(
			cypher.createClient.bind(cypher, connection_string, connection_opts)
		).then(cache_client);
	}

	// Caches a client for later use
	function cache_client(client) {
		client_cache = client;
		return client;
	}
}

function make_promise(thunk) {
	return new Promise(function(reject, resolve) {
		thunk(function(err, result) {
			if (err) reject(err);
			else resolve(result);
		});
	});
}
