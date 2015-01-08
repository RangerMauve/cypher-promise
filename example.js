// Require the module
var cypher = require("../");

// Connect to a DB
var client = cypher("http://localhost:7474");

// Make a query
client.query("MATCH (n:Person) RETURN count(n)")
	.then(function(result) {
		// Log the result
		console.log(result);
	});

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
multi.exec();

// Once all the promises resolve
Promise.all(queries)
	.then(function(results) {
		// Log them
		console.log(results);
	});
