laraImport("lara.graphs.Graphs")
laraImport("lara.Strings")
laraImport("lara.Check")
laraImport("clava.graphs.cfg.CfgNode")
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
/*
			if($currentJp.instanceOf("body")) {
				if($currentJp.parent.instanceOf("loop") && $currentJp.parent.kind == "for") {
					
					$currentJp.insertBegin(ClavaJoinPoints.comment("FOR_START"))
					$currentJp.insertEnd(ClavaJoinPoints.comment("FOR_END"))
					continue
					
				} else if($currentJp.parent.instanceOf("if")) {
					
					$currentJp.insertBegin(ClavaJoinPoints.comment("IF_START"))
					$currentJp.insertEnd(ClavaJoinPoints.comment("IF_END"))
					continue
					
				}
				if($currentJp.instanceOf("scope")) {
					$currentJp.insertBegin(ClavaJoinPoints.comment("SCOPE_START"))
					$currentJp.insertEnd(ClavaJoinPoints.comment("SCOPE_END"))				
				}
			}	
			*/
		}
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
				
				// TODO: If INST_LIST, associate all other statements of the INST_LIST to the node?
			} 
			/*
			else {
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
			*/
		}
		
	}

/*
	_fillNodes() {
		// TODO

		// Special case: if the leader is a scope, you should replace the first statement 
		// (which is of type scope) with the first statement of the scope, and add statements
		// until a leader statement appears. 
		// If the first statement of the scope is a leader statement, the graph node should have
		// 0 statements

	}
*/

/*
	_connectNodes2() {

		let nodes = []

		for(const value of this.#nodes.values()) 
			nodes.push(value)

		for(let i = 1; i < nodes.length; i++) {
			let previousNode = nodes[i-1]
			let currentNode = nodes[i]

			println(currentNode)









		}




	}
*/



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
				const ifStmt = node.data().getIf();

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
				const $loop = node.data().getLoop();
				
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
				const $condStmt = node.data().getStmt();
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
				const $initStmt = node.data().getStmt();
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
				const $stepStmt = node.data().getStmt();
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
				const stmts = node.data().getStmts();
				const $lastStmt = stmts[stmts.length-1];
				
				const $nextExecutedStmt = CfgUtils.nextExecutedStmt($lastStmt);
				let afterNode = this.#nodes.get($nextExecutedStmt.astId);

				if(afterNode === undefined) {
					afterNode = this.#endNode;
				}
					
				
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));						
			}
			
			// SCOPE_NODEs
			if(nodeType === CfgNodeType.SCOPE || nodeType === CfgNodeType.THEN || nodeType === CfgNodeType.ELSE) {
				const stmts = node.data().getStmts();
				const $scope = node.data().getScope();

				// Scope connects to its own first statement that will be an INST_LIST
				let afterNode = this.#nodes.get($scope.firstStmt.astId);
				
				Graphs.addEdge(this.#graph, node, afterNode, new CfgEdge(CfgEdgeType.UNCONDITIONAL));						
			}

		}
	}

	
	/*
	_connectNodes_old() {
		// TODO
		//Graphs.addEdge(this.#graph, this.#startNode, node, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
		
		let nodes = []

		for(const value of this.#nodes.values()) 
			nodes.push(value)
	

		for(let i = 1; i < nodes.length; i++) {
			let previousNode = nodes[i-1]

			if(previousNode.data().type !== undefined) {


				// IF NODE
				if(previousNode.data().type.name === "IF") {
					let ifStmt = previousNode.data().getStmts()[0]
					
					if(ifStmt.else !== undefined) {
	
						let elseId = ifStmt.else.astId
						let elseNode = this.#nodes.get(elseId)
						Graphs.addEdge(this.#graph, previousNode, elseNode, new CfgEdge(CfgEdgeType.FALSE));
				
					} else {

						if(ifStmt.siblingsRight.length > 0) {

							let nextScopeId = ifStmt.siblingsRight[0].astId
							let nextScope = this.#nodes.get(nextScopeId)
							Graphs.addEdge(this.#graph, previousNode, nextScope, new CfgEdge(CfgEdgeType.FALSE));
							
						}

					}
	
					Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.TRUE));
				

				// FOR NODE
				} else if(previousNode.data().type.name === "FOR") {
					
					Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.TRUE));
					
					
					let forStmt = previousNode.data().getStmts()[0] // For Statement
					// FOR STATEMENT IS NOT THE LAST STATEMENT OF THE SCOPE

					if(forStmt.siblingsRight[0] !== undefined) {

						if(forStmt.parent.parent.instanceOf("loop") && forStmt.parent.parent.kind === "for") {

							

						} else {

							let siblingId = forStmt.siblingsRight[0].astId
							let siblingNode = this.#nodes.get(siblingId) // o

							Graphs.addEdge(this.#graph, previousNode, siblingNode, new CfgEdge(CfgEdgeType.FALSE));
						}
						
	

						
	
					} else {	
							
						Graphs.addEdge(this.#graph, previousNode, nodes[nodes.length-1], new CfgEdge(CfgEdgeType.FALSE));						
					}


				// SCOPES
				} else {
					if(nodes[i].data().toString().trim() === "END_FOR") {
						let forScopeId = nodes[i].data().stmts[0].parent.parent.astId
						let forScope = this.#nodes.get(forScopeId)
						println(nodes[i].data().stmts[0].parent.parent)
						Graphs.addEdge(this.#graph, nodes[i], forScope, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
					}
					if(previousNode.data().toString().trim() !== "END_FOR")
						Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.UNCONDITIONAL));
				}
			
			} else {
				if(previousNode.data().toString().trim() !== "END_FOR") 
				Graphs.addEdge(this.#graph, previousNode, nodes[i], new CfgEdge(CfgEdgeType.UNCONDITIONAL));
			}

		}
	}		
*/
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


/*
	_ifLoops(ifScope, parent) {
		for(let descendant of ifScope.data().stmts[0].descendants) {
			if(descendant.instanceOf("if"))
				this._ifLoops(descendant, ifScope)
			else if(descendant.instanceOf("loop")) {
				this._forLoops(descendant, ifScope)
			}
		}
		if(parent !== undefined) {
			Graphs.addEdge(this.#graph, ifScope, parent, new CfgEdge(CfgEdgeType.UNCONDITIONAL));
		}
		else {

		}


	}
*/
/*
	_forLoops(forScope, parent) {
		println(forScope)
		if(forScope !== undefined) {

			for(let descendant of forScope.data().stmts[0].descendants) {
				
				if(descendant.instanceOf("loop")) {
					this._forLoops(descendant, forScope)
				}
				else if(descendant.instanceOf("if")) {
					this._ifLoops(descendant, forScope)
				}
			}
		}
		if(parent !== undefined)
			Graphs.addEdge(this.#graph, forScope, parent, new CfgEdge(CfgEdgeType.UNCONDITIONAL));

	}
	*/

	
	/*
	_getDeclStmt($stmt) {
		if($stmt.firstChild.instanceOf("declStmt")) {
			return $stmt.firstChild
		}
		else if($stmt.instanceOf('declStmt') || $stmt.instanceOf('returnStmt') || $stmt.instanceOf('wrapperStmt')) {
			return $stmt
		}

		return undefined
	}
	*/

	/*
	_createCfgNode($stmt, nodeType) {
		let declStmt = this._getDeclStmt($stmt)
		let cfgNode = DataFactory.newData(nodeType, declStmt)

		
		if(declStmt !== undefined) {
			if(declStmt.instanceOf("wrapperStmt")) {
				return cfgNode
			}

			// Add statements until leader node is found
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
	*/

	/*
	_createLeaderStmt($stmt) {
		const nodeType = CfgUtils.getNodeType($stmt);
		let cfgNode = this._createCfgNode($stmt, nodeType)
		let node = Graphs.addNode(this.#graph, cfgNode);
		this.#nodes.set($stmt.astId, node)
	}
	*/

	
	/**
	 * Returns the node corresponding to this statement, or creates a new one if one does not exist yet.
	 */
	_getOrAddNode($stmt, create) {
		const _create = create ?? false;
		//println($stmt.dump)
		let node = this.#nodes[$stmt.astId];
		// If there is not yet a node for this statement, create
		if(node === undefined && _create) {

		
			const nodeType = CfgUtils.getNodeType($stmt);
			//if(nodeType.name !== 'SCOPE') {
				node = Graphs.addNode(this.#graph, DataFactory.newData(nodeType, $stmt));
	
				this.#nodes.set($stmt.astId, node);
			//}
			
		
			// Example of how to add an edge:
			// Graphs.addEdge(this.#graph, this.#startNode, node, new CfgEdge(CfgEdgeType.TRUE));
		} else {
			throw new Error("No node for statement at line " + $stmt.line);
		}
		
		return node;
	}
	
}