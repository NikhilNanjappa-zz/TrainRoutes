// To process the graphs
(function(graphService) {
	"use strict";

	// A class for a vertex
	var Vertex = function(name) {
		this.getName = function() {return name};
		var edges = [];
		var neighbourhood = {};
		this.getEdges = function() {return edges;};
		this.addEdge = function(edge) {
			// Do not allow duplicates
			if(neighbourhood[edge.getDest()])
				throw new Error(this+" already has "+edge);
			neighbourhood[edge.getDest()] = edge;

			edges.push(edge)
		};
		this.getEdgeTo = function(vertex) {
			return neighbourhood[vertex];
		}
	}

	Vertex.prototype.toString = function() {
		return "[Vertex "+this.getName()+"]";
	}

	// A class for an edge
	var Edge = function(dest, weight) {
		if(!(dest instanceof Vertex))
			throw new TypeError("Edge destination must be a vertex");
		this.getDest = function() {return dest;};
		this.getWeight = function() {return weight;};
	}

	Edge.prototype.toString = function() {
		return "[Edge -> "+this.getDest()+"]";
	}

	// Parse strings inot the graph.
	graphService.parseGraph =  function() {
		var vertexSet = {};

		for(var i = 0; i < arguments.length; i++) {
			var edgeStrs = arguments[i].split(/i,|\s/);
			for(var j = 0; j < edgeStrs.length; j++) {
				var edgeStr = edgeStrs[j];
				if(edgeStr.length >= 3) {
					//Parse
					var v1 = edgeStr[0];
					var v2 = edgeStr[1];
					var weight = edgeStr.slice(2);
					if(weight.match(/^-?[0-9]*$/) == null)
						throw new TypeError("Edge weights must be integers");
					weight = parseInt(weight);
					if(weight <= 0)
						throw new TypeError("Edge weights must be +ve");

					//Update vertex set
					if(vertexSet[v1] == null)
						vertexSet[v1] = new Vertex(v1);
					if(vertexSet[v2] == null)
						vertexSet[v2] = new Vertex(v2);

					//Add edge
					vertexSet[v1].addEdge(new Edge(vertexSet[v2], weight));

				//Throw error if description is too short.
				} else if(edgeStr.length > 0)
					throw new Error("Edge descriptions should match the format in the example");
			}
		}
		return vertexSet;
	}

	// Calculate the length of a path in a graph
	graphService.measurePath = function(vertexSet, path) {
		//Get actual vertices from names
		path = path.map(function(name) { return vertexSet[name]; });

		//Do the measurement
		var length = 0;
		for(var i = 0, j = 1; j < path.length; j = (i = j) + 1) {
			if(path[i] == null)
				return null;
			var edge = path[i].getEdgeTo(path[j]);
			if(edge == null)
				return null;
			else
				length += edge.getWeight();
		}
		return length;
	}

	var PriorityQueue = typeof FibonacciHeap != "undefined" ? FibonacciHeap : require("./fibHeapService.js");

	// Calculates the distance between two nodes in a graph.
	graphService.getDistance = function(start, end) {
		var verticesToCheck = new PriorityQueue();
		var hasBeenQueued = {};
		var processVertex = function(vertex, distance) {
			var edges = vertex.getEdges();
			for(var i = 0; i < edges.length; i++) {
				var newVert = edges[i].getDest();
				var newDist = distance + edges[i].getWeight();
				if(hasBeenQueued[newVert])
					try { 
						verticesToCheck.decreaseKey(newVert, newDist);
					} catch(e) {}
				else {
					verticesToCheck.add(newDist, newVert);
					hasBeenQueued[newVert] = true;
				}
			}
		}

		//Starting vertex in with priority 0.
		processVertex(start, 0);

		var queueElem;
		while((queueElem = verticesToCheck.extractMin()) != null) {
			var distance = queueElem.key;
			var vertex = queueElem.value;
			if(vertex == end)
				return distance;
			else
				processVertex(vertex, distance);
		}
		return null;
	};

	// Calculate the numbers of paths from one vertex to another
	graphService.numPaths = function(startVertex, endVertex, maxLength, exactLength, useWeights, vertexSet) {
		var pathCounts = [];
		for(var thisLen = 0; thisLen <= maxLength; thisLen++) {
			pathCounts[thisLen] = {};
			for(var vertexName in vertexSet) {
				var vertex = vertexSet[vertexName];
				var count = 0;
				var edges =	vertex.getEdges();
				for(var i = 0; i < edges.length; i++) {
					var edgeLen = useWeights ? edges[i].getWeight() : 1;
					var edgeDest = edges[i].getDest();
					if(edgeLen <= thisLen)
						count += pathCounts[thisLen-edgeLen][edgeDest];
				}
				if((vertex == endVertex) && (!exactLength || (thisLen == 0)))
					count++;
				pathCounts[thisLen][vertex] = count;
			}
		}

		//Subtract out path of length 0 and return
		return pathCounts[maxLength][startVertex] -
				((!exactLength || (maxLength == 0)) &&
					(startVertex == endVertex) ? 1 : 0);
	}
})(
	// Exporting
	(typeof module == "object") && (typeof module.exports == "object") ?
		module.exports : (this.graphService = {})
);
