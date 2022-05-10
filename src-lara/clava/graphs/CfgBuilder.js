laraImport("lara.graphs.Graphs")
laraImport("lara.Strings")
laraImport("lara.Check")
laraImport("clava.graphs.CfgNode")
laraImport("clava.graphs.CfgNodeType");
laraImport("clava.graphs.CfgEdge")
laraImport("clava.graphs.CfgEdgeType");
laraImport("clava.graphs.Cfg");
laraImport("clava.graphs.CfgUtils");

class CfgBuilder {
	
	/**
	 * AST node to process
	 */
	#jp;

	/**
	 * Graph being built
	 */
	#graph;
	
	/**
	 * Maps stmts to graph nodes
	 */
	#nodes; 
	
	/**
	 * The start node of the graph
	 */
	#startNode;

	/**
 	 * The end node of the graph
 	 */	
	#endNode;
	
	constructor($jp) {
		this.#jp = $jp;
		
		// Load graph library
		Graphs.loadLibrary();
		
		this.#graph = cytoscape({ /* options */ });
		this.#nodes = new Map;
		
		// Create start
		this.#startNode = Graphs.addNode(this.#graph, new CfgNode(CfgNodeType.START));
		this.#nodes.set('START', this.#startNode)
		
		
	}
	
	static buildGraph($jp) {
		return new CfgBuilder($jp).build();
	}
	
	build() {
		this._createNodes();
		// Create End Node
		this.#endNode = Graphs.addNode(this.#graph, new CfgNode(CfgNodeType.END));
		this.#nodes.set('END', this.#endNode)

		//this._fillNodes();	
		this._connectNodes();		
		return this.#graph;
	}
	
	
	/**
	 * Creates all nodes (except start and end), with only the leader statement
	 */
	_createNodes() {
		//println("Start jp: " + this.#jp.dump);
		
		// Test all statements for leadership
		// If they are leaders, create node
		for(const $stmt of Query.searchFromInclusive(this.#jp, "statement")) {
			//println("Is leader?: " + CfgUtils.isLeader($stmt) + ' -> ' +$stmt.line);			
			if(CfgUtils.isLeader($stmt)) {	
				this._getOrAddNode($stmt, true);
			}
			else 
			{
				// First statement after Start Node is Leader
				if($stmt.siblingsLeft.length == 0 && CfgUtils.isLeader($stmt.parent)) {
					if($stmt.parent.kind === 'for') 
						continue
					this._createLeaderStmt($stmt)
				}
				// Statement after Leader statements is Leader
				else if (CfgUtils.isLeader($stmt.siblingsLeft[$stmt.siblingsLeft.length-1])) {
					this._createLeaderStmt($stmt)
				}
			}
		}
		
	}


	_fillNodes() {
		// TODO

		// Special case: if the leader is a scope, you should replace the first statement 
		// (which is of type scope) with the first statement of the scope, and add statements
		// until a leader statement appears. 
		// If the first statement of the scope is a leader statement, the graph node should have
		// 0 statements

		for(let stmt in this.#nodes) {
			let node = this.#nodes[stmt]
			
		}

	}
	
	_connectNodes() {
		// TODO
		//Graphs.addEdge(this.#graph, this.#startNode, node, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
		
		let nodes = []

		for(const value of this.#nodes.values()) 
			nodes.push(value)
	

		for(let i = 1; i < nodes.length; i++) {
			let previousNode = nodes[i-1]

			if(previousNode.data().type !== undefined) {

				if(previousNode.data().type.name === "IF") {
					let ifStmt = previousNode.data().getStmts()[0]
					
					if(ifStmt.else !== undefined) {
	
						let elseId = ifStmt.else.astId
						let elseNode = this.#nodes.get(elseId)
						Graphs.addEdge(this.#graph, previousNode, elseNode, new CfgEdge(CfgEdgeType.FALSE));
				
					}
	
					Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.TRUE));
				
				} else if(previousNode.data().type.name === "FOR") {
					
					Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.TRUE));
					
					
					let forStmt = previousNode.data().getStmts()[0] // For Statement
					print('for stmt: ')
					println(forStmt)
					println(forStmt.parent.parent.astName) 
					
					if(forStmt.siblingsRight[0] !== undefined) {
						
						let siblingId = forStmt.siblingsRight[0].astId
						let siblingNode = this.#nodes.get(siblingId)
	
						for(let k = i; k < nodes.length; k++) {
							if(nodes[k] === siblingNode) {
								Graphs.addEdge(this.#graph, nodes[k-1], this.#nodes.get(nodes[k-1].data().getStmts()[0].parent.parent.astId), new CfgEdge(CfgEdgeType.UNCONDITIONAL));
								
							}
						}
						
						Graphs.addEdge(this.#graph, previousNode, siblingNode, new CfgEdge(CfgEdgeType.FALSE));
	
					} else {
						if(forStmt.parent.parent.astName === 'ForStmt') {

							Graphs.addEdge(this.#graph, previousNode, this.#nodes.get(forStmt.parent.parent.astId), new CfgEdge(CfgEdgeType.FALSE));
						}
						else {

							Graphs.addEdge(this.#graph, nodes[nodes.length-2], previousNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
							Graphs.addEdge(this.#graph, previousNode, nodes[nodes.length-1], new CfgEdge(CfgEdgeType.FALSE));
						}
						
					}

				} else {
				
					Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.UNCONDITIONAL));
				}

			
			
			} else {
				
				Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.UNCONDITIONAL));
				
			}

		}








		/**

		for(const[key, value] of this.#nodes.entries()) {
			if(oldKey === undefined) {
				oldKey = key
				continue
			} 
			let oldNode = this.#nodes.get(oldKey)
			//println(oldNode.data().getStmt())
			
			if(oldNode.data().toString().slice(0,2) == "IF") {
				let stmt = oldNode.data().getStmts()[0]
				if(stmt.else !== undefined) {

					let elseId = stmt.else.astId
					let elseNode = this.#nodes.get(elseId)
					Graphs.addEdge(this.#graph, oldNode, elseNode, new CfgEdge(CfgEdgeType.FALSE));
				
				}
				
				Graphs.addEdge(this.#graph, oldNode, value, new CfgEdge(CfgEdgeType.TRUE));
				
			
			} else if(isForNode || oldNode.data().toString().slice(0,3) == "FOR") {
				if(!isForNode)
					Graphs.addEdge(this.#graph, oldNode, value, new CfgEdge(CfgEdgeType.TRUE));
				Graphs.addEdge(this.#graph, value, oldNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
				
				let stmt = oldNode.data().getStmts()[0]
				let siblingId = stmt.siblingsRight[0].astId
				let siblingNode = this.#nodes.get(siblingId)
				forNode = value
				Graphs.addEdge(this.#graph, oldNode, siblingNode, new CfgEdge(CfgEdgeType.FALSE));
				
				
				//isForNode = true
			
			} else {
				Graphs.addEdge(this.#graph, oldNode, value, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
			}

			oldKey = key
		}

		*/

	}		


	_connectForNodes(finalNodeId, iterator, nodes) {
		for(let i = iterator; i < nodes.length; i++) {
			if(nodes[i] === this.#nodes.get(finalNodeId))
				return

			previousNode = nodes[i-1]

			Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.UNCONDITIONAL))
		}
	}

	_connectIfNodes(nodes, iterator, ) {

	}
	
	_getKey(map, input) {
		for (const [key, value] of map.entries()) {
			if (value === input) {
				return key;
			}
		}
		
		return undefined;
	}
	

	
	_getDeclStmt($stmt) {
		if($stmt.firstChild.instanceOf("declStmt")) {
			return $stmt.firstChild
		}
		else if($stmt.instanceOf('declStmt') || $stmt.instanceOf('returnStmt')) {
			return $stmt
		}

		return undefined
	}

	_createCfgNode($stmt, nodeType) {
		let declStmt = this._getDeclStmt($stmt)
		let cfgNode = new CfgNode(nodeType, declStmt)
		
		if(declStmt !== undefined) {

			for(let sibling of declStmt.siblingsRight) {
				if(CfgUtils.isLeader(sibling)) {
					break;
				} else {
					cfgNode.addStmt(sibling)
				}
			}
		}
		return cfgNode
	}

	_createLeaderStmt($stmt) {
		const nodeType = CfgUtils.getNodeType($stmt);
		let cfgNode = this._createCfgNode($stmt, nodeType)
		let node = Graphs.addNode(this.#graph, cfgNode);
		this.#nodes.set($stmt.astId, node)
	}

	
	
	/**
	 * Returns the node corresponding to this statement, or creates a new one if one does not exist yet.
	 */
	_getOrAddNode($stmt, create) {
		const _create = create ?? false;
		println($stmt.dump)
		let node = this.#nodes[$stmt.astId];
		// If there is not yet a node for this statement, create
		if(node === undefined && _create) {

		
			const nodeType = CfgUtils.getNodeType($stmt);
			if(nodeType.name !== 'SCOPE') {

				node = Graphs.addNode(this.#graph, new CfgNode(nodeType, $stmt));
	
				this.#nodes.set($stmt.astId, node);
			}
			
		
			// Example of how to add an edge:
			// Graphs.addEdge(this.#graph, this.#startNode, node, new CfgEdge(CfgEdgeType.TRUE));
		} else {
			throw new Error("No node for statement at line " + $stmt.line);
		}
		
		return node;
	}
	
}