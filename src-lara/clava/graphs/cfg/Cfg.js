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
		this.#nodes = nodes;
		this.#startNode = startNode;
		this.#endNode = endNode;		
	}

	get graph() {
		return this.#graph;
	}

	get nodes() {
		return this.#graph;
	}

	get startNode() {
		return this.#startNode;
	}

	get endNode() {
		return this.#endNode;
	}	
}