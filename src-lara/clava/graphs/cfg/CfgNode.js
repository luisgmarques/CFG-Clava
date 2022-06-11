laraImport("clava.graphs.cfg.CfgNodeType");
laraImport("lara.graphs.NodeData");
laraImport("clava.ClavaJoinPoints");

/**
 * The data of a CFG node.
 */
class CfgNode extends NodeData {
	
	/**
	 * The statement that originated this node
	 */
	#nodeStmt;

	//stmts;
	#type;

	#name;
	
	constructor(cfgNodeType, $stmt) {
		//println("Stmt undefined? " + ($stmt === undefined));
		const id = $stmt === undefined ? undefined : $stmt.astId;
		//println("Id: " + id)
		// Use AST node id as graph node id
		super(id);

		this.#nodeStmt = $stmt;
		/**if(cfgNodeType === undefined) {
			throw new Error("Must define a cfg node type");
		}*/

		//this.stmts = [];
		
		// If statement defined, add it to list of statements
		/*
		if($stmt !== undefined) {
			this.stmts.push($stmt);			
		}
		*/

		this.#type = cfgNodeType;

	}

	get type() {
		return this.#type;
	}

	get name() {
		if(this.#name === undefined) {
			const typeName = this.#type.name;
			this.#name = typeName.substring(0,1).toUpperCase() + typeName.substring(1,typeName.length).toLowerCase();
		}

		return this.#name;
		//return this.type.name; 
	}

	/*
	addStmt($stmt) {
		this.stmts.push($stmt);
	}

	getStmts() {
		return this.stmts
	}
	*/

	get nodeStmt() {
		return this.#nodeStmt;
	}

	toString() {

		// By default, content of the node is the name of the type
		return this.name.substring(0,1).toUpperCase() + this.name.substring(1,this.name.length).toLowerCase();

		/*
		// Special cases

		if(this.type === CfgNodeType.START) {
			return "Start";
		}
		
		if(this.type === CfgNodeType.END) {
			return "End";
		}
		
		let code = "";
		
		// TODO: Each type of statement needs its "toString", for instance, a for should only print its header
		for(let $stmt of this.stmts) {
			var nodeType = CfgUtils.getNodeType($stmt);
			
			//println("Node type: " + nodeType)
			//println("Node name: " + nodeType.name)
			
			//const showStatements = nodeType === CfgNodeType.SCOPE || nodeType === CfgNodeType.THEN || nodeType === CfgNodeType.ELSE || nodeType === undefined;

			let stmtCode = nodeType !== undefined ? nodeType.name : $stmt.code;
			//let stmtCode = showStatements ? $stmt.code : nodeType.name;
			
			//println("Code: " + stmtCode);
			
			//code += stmtCode.replaceAll("\n", "\\l").replaceAll("\r", "");
			//code += "\\l";
			
			code += stmtCode + "\n";
		}
		
		return code;
		*/
	}


}

