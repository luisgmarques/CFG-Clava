laraImport("lara.graphs.Graphs")
laraImport("lara.Strings")
laraImport("lara.Check")
laraImport("clava.graphs.cfg.CfgNodeData")
laraImport("clava.graphs.cfg.CfgNodeType");
laraImport("clava.graphs.cfg.CfgEdge")
laraImport("clava.graphs.cfg.CfgEdgeType");
laraImport("clava.graphs.cfg.Cfg");
laraImport("clava.graphs.cfg.CfgUtils");
laraImport("clava.graphs.cfg.nodedata.DataFactory")
laraImport("clava.ClavaJoinPoints")

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
		
		// Create start node
		this.#startNode = Graphs.addNode(this.#graph, DataFactory.newData(CfgNodeType.START));
		this.#nodes.set('START', this.#startNode)
		
		// Create end node
		this.#endNode = Graphs.addNode(this.#graph, DataFactory.newData(CfgNodeType.END));
		this.#nodes.set('END', this.#endNode)		
	}
	
	static buildGraph($jp) {
		return new CfgBuilder($jp).build();
	}
	
	build() {
		this._addAuxComments()
		this._createNodes();

		//this._fillNodes();	
		this._connectNodes();		
		return new Cfg(this.#graph, this.#nodes, this.#startNode, this.#endNode);
	}
	

	_addAuxComments() {
		
		for(const $currentJp of this.#jp.descendants) {
			if($currentJp.instanceOf("scope")) {
				$currentJp.insertBegin(ClavaJoinPoints.comment("SCOPE_START"))
				$currentJp.insertEnd(ClavaJoinPoints.comment("SCOPE_END"))
			}
		}
	}
	
	/**
	 * Creates all nodes (except start and end), with only the leader statement
	 */
	_createNodes() {
		
		// Test all statements for leadership
		// If they are leaders, create node
		for(const $stmt of Query.searchFromInclusive(this.#jp, "statement")) {
			//println("Is leader?: " + CfgUtils.isLeader($stmt) + ' -> ' +$stmt.line);		
			
			if(CfgUtils.isLeader($stmt)) {
				this._getOrAddNode($stmt, true);
				
				// TODO: If INST_LIST, associate all other statements of the INST_LIST to the node?
			} 
		}
		
	}


	_connectNodes() {
		
		// Connect start
		let startAstNode = this.#jp;
		if(startAstNode.instanceOf("function")) {
			startAstNode = startAstNode.body;
		}
		
		if(!startAstNode.instanceOf("statement")) {
			throw new Error("Not defined how to connect the Start node to an AST node of type " + this.#jp.joinPointType);
		} 
		
		let afterNode = this.#nodes.get(startAstNode.astId);				
		Graphs.addEdge(this.#graph, this.#startNode, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));		
		

		for(const node of this.#nodes.values()) {

			const nodeType = node.data().type;

			if(nodeType === undefined) {
				//printlnObject( node.data());
				//throw new Error("Node type is undefined: ");
				continue;
			}			

			// IF NODE - TODO, adapt to specific node data
			if(nodeType === CfgNodeType.IF) {
				const ifStmt = node.data().if;

				const thenStmt = ifStmt.then;
				const thenNode = this.#nodes.get(thenStmt.astId);

				Graphs.addEdge(this.#graph, node, thenNode, new CfgEdge(CfgEdgeType.TRUE));

				
				const elseStmt = ifStmt.else
				
				if(elseStmt !== undefined) {
					const elseNode = this.#nodes.get(elseStmt.astId)
					Graphs.addEdge(this.#graph, node, elseNode, new CfgEdge(CfgEdgeType.FALSE));
				}
				else {
					// There should always be a sibling, because of inserted comments
					const after = ifStmt.siblingsRight[0];
					//println(after)
					const afterNode = this.#nodes.get(after.astId);							
					Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.FALSE));	
				}
			}

			if(nodeType === CfgNodeType.LOOP_HEADER) {
				const $loop = node.data().loop;
				
				let afterStmt = undefined;
				
				switch($loop.kind) {
					case "for":
						afterStmt = $loop.init;
						break;
					case "while":
						afterStmt = $loop.cond;
						break;						
					case "dowhile":
						afterStmt = $loop.body;
						break;					
					default:
						throw new Error("Case not defined for loops of kind " + $loop.kind);
				}
				
				const afterNode = this.#nodes.get(afterStmt.astId);							
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));	
			}

			if(nodeType === CfgNodeType.COND) {
				// Get kind of loop
				const $condStmt = node.data().nodeStmt;
				const $loop = $condStmt.parent;
				isJoinPoint($loop, "loop");
				
				const kind = $loop.kind;
				// True - first stmt of the loop body
				const trueNode = this.#nodes.get($loop.body.astId);	
				Graphs.addEdge(this.#graph, node, trueNode, new CfgEdge(CfgEdgeType.TRUE));	
					
				// False - next stmt of the loop
				const $nextExecutedStmt = CfgUtils.nextExecutedStmt($loop);
				const falseNode = this.#nodes.get($nextExecutedStmt.astId);		
				Graphs.addEdge(this.#graph, node, falseNode, new CfgEdge(CfgEdgeType.FALSE));	
				
			}

			if(nodeType === CfgNodeType.INIT) {				
				// Get loop
				const $initStmt = node.data().nodeStmt;
				const $loop = $initStmt.parent;
				isJoinPoint($loop, "loop");
				if($loop.kind !== "for") {
					throw new Error("Not implemented for loops of kind " + $loop.kind);
				}
				
				const $condStmt = $loop.cond;
				if($condStmt === undefined) {
					throw new Error("Not implemented when for loops do not have a condition statement");					
				}
				
				const afterNode = this.#nodes.get($condStmt.astId);		
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));					
			}
				
				
			if(nodeType === CfgNodeType.STEP) {				
				// Get loop
				const $stepStmt = node.data().nodeStmt;
				const $loop = $stepStmt.parent;
				isJoinPoint($loop, "loop");
				if($loop.kind !== "for") {
					throw new Error("Not implemented for loops of kind " + $loop.kind);
				}				
				
				const $condStmt = $loop.cond;
				if($condStmt === undefined) {
					throw new Error("Not implemented when for loops do not have a condition statement");					
				}
				
				const afterNode = this.#nodes.get($condStmt.astId);		
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));									
			}
			
			// INST_LIST NODE
			if(nodeType === CfgNodeType.INST_LIST) {
				//const stmts = node.data().getStmts();
				//const $lastStmt = stmts[stmts.length-1];
				const $lastStmt = node.data().getLastStmt();
				const $nextExecutedStmt = CfgUtils.nextExecutedStmt($lastStmt);
				let afterNode = this.#nodes.get($nextExecutedStmt.astId);

				if(afterNode === undefined) {
					afterNode = this.#endNode;
				}
					
				
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));						
			}
			
			// SCOPE_NODEs
			if(nodeType === CfgNodeType.SCOPE || nodeType === CfgNodeType.THEN || nodeType === CfgNodeType.ELSE) {
				//const stmts = node.data().getStmts();
				const $scope = node.data().scope;

				// Scope connects to its own first statement that will be an INST_LIST
				let afterNode = this.#nodes.get($scope.firstStmt.astId);
				
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));						
			}

		}
	}
	
	/**
	 * Returns the node corresponding to this statement, or creates a new one if one does not exist yet.
	 */
	_getOrAddNode($stmt, create) {
		const _create = create ?? false;
		let node = this.#nodes[$stmt.astId];

		// If there is not yet a node for this statement, create
		if(node === undefined && _create) {

			const nodeType = CfgUtils.getNodeType($stmt);
			node = Graphs.addNode(this.#graph, DataFactory.newData(nodeType, $stmt));
			this.#nodes.set($stmt.astId, node);

		} else {
			throw new Error("No node for statement at line " + $stmt.line);
		}
		
		return node;
	}
	
}