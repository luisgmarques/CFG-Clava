class Cfg {
	
	/**
	 * A Cytoscape graph representing the CFG
	 */ 
	#graph;

	/**
	 * Maps stmts to graph nodes
	 */
	#nodes; 

	/**
	 * The start node of the CFG
	 */ 
	#startNode;

	/**
	 * The end node of the CFG
	 */ 
	#endNode;
	
	constructor(graph, nodes, startNode, endNode) {
		this.#graph = graph;
		this.nodes = nodes;
		this.#startNode = startNode;
		this.#endNode = endNode;		
	}

	getGraph() {
		return this.#graph;
	}


	getNodes() {
		return this.#graph;
	}

	getStartNode() {
		return this.#startNode;
	}

	getEndNode() {
		return this.#endNode;
	}	
}