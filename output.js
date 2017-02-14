/* To Output the Answers */

var graphService = typeof graphService != "undefined" ? graphService :
				require("./graphService.js");

var graph = graphService.parseGraph.apply(graphService,
				typeof process == "object" ? process.argv.slice(2) :
				Array.isArray(window.socrata_input) ? 
				window.socrata_input : [window.socrata_input]);

var noRoute = "NO SUCH ROUTE";

//Question 1
var answer = graphService.measurePath(graph, ["A", "B", "C"]);
console.log(answer == null ? noRoute : answer);

//Question 2
answer = graphService.measurePath(graph, ["A", "D"]);
console.log(answer == null ? noRoute : answer);

//Question 3
answer = graphService.measurePath(graph, ["A", "D", "C"]);
console.log(answer == null ? noRoute : answer);

//Question 4
answer = graphService.measurePath(graph, ["A", "E", "B", "C", "D"]);
console.log(answer == null ? noRoute : answer);

//Question 5
answer = graphService.measurePath(graph, ["A","E","D"]);
console.log(answer == null ? noRoute : answer);

//Question 6
answer =	graph.C == null ? null :
			graphService.numPaths(graph.C, graph.C, 3, false, false, graph);

console.log(answer == null ? 0 : answer);

//Question 7
answer =	graph.C == null ? null :
			graph.A == null ? null :
			graphService.numPaths(graph.A, graph.C, 4, true, false, graph);

console.log(answer == null ? 0 : answer);

//Question 8
answer =	graph.A == null ? null :
			graph.C == null ? null :
			graphService.getDistance(graph.A, graph.C);

console.log(answer == null ? noRoute : answer);

//Question 9 
answer =	graph.B == null ? null :
			graphService.getDistance(graph.B, graph.B);

console.log(answer == null ? noRoute : answer);

//Question 10
answer =	graph.C == null ? null :
			graphService.numPaths(graph.C, graph.C, 29, false, true, graph);

console.log(answer == null ? 0 : answer);
