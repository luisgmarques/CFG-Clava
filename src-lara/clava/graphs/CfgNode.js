laraImport("clava.graphs.CfgNodeType");
laraImport("lara.graphs.GraphNode");
laraImport("clava.ClavaJoinPoints");

/**
 * The data of a CFG node.
 */
class CfgNode extends GraphNode {
	
	stmts;
	type;
	
	constructor(cfgNodeType, $stmt) {
		super();
		
		/**if(cfgNodeType === undefined) {
			throw new Error("Must define a cfg node type");
		}*/

		this.stmts = [];
		
		// If statement defined, add it to list of statements
		if($stmt !== undefined) {
			this.stmts.push($stmt);			
		}

		this.type = cfgNodeType;

	}

	get name() {
		return this.type.name(); 
	}

	addStmt($stmt) {
		this.stmts.push($stmt);
	}

	getStmts() {
		return this.stmts
	}

	toString() {
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
	}
}