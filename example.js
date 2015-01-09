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
