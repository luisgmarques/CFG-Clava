laraImport("clava.graphs.cfg.CfgNodeType");

class CfgUtils {
	
	/** 
	 * @return {boolean} true if the statement is considered a leader
	 */
	static isLeader($stmt) {
		const graphNodeType = CfgUtils.getNodeType($stmt);
		
		return graphNodeType !== undefined;
	}
	
	/**
	 * Returns the type of graph node based on the type of the leader statement. If this statement is not a leader, returns undefined
	 */
	static getNodeType($stmt) {
		
		// If stmt
		if($stmt.instanceOf("if")) {
			return CfgNodeType.IF;			
		}
		
		// For stmt
		if($stmt.instanceOf("loop") && $stmt.kind === "for") {
			return CfgNodeType.FOR;
		}

		// Body stmt
		/*
		if($stmt.instanceOf("body")) {
			return CfgNodeType.BODY;
		}
		*/
/*
		if($stmt.instanceOf("wrapperStmt")) {
			if($stmt.code.trim() === "//SCOPE_START")
				return CfgNodeType.SCOPE_START
			if($stmt.code.trim() === "//SCOPE_END")
				return CfgNodeType.SCOPE_END
			if($stmt.code.trim() === "//FOR_START")
				return CfgNodeType.FOR_START
			if($stmt.code.trim() === "//FOR_END")
				return CfgNodeType.FOR_END
			if($stmt.code.trim() === "//IF_START")
				return CfgNodeType.IF_START
			if($stmt.code.trim() === "//IF_END")
				return CfgNodeType.IF_END
			
		}
		*/		
/*
		if($stmt.instanceOf("body")) {
			const parent = $stmt.parent
			if(parent.instanceOf("function"))
				return CfgNodeType.SCOPE_DATA
		}
		*/
		// Scope stmt
		if($stmt.instanceOf("scope")) {
			const parent = $stmt.parent;
			if(parent.instanceOf("if")) {
				if($stmt.equals(parent.then)) {
					return CfgNodeType.THEN;		
				} else if($stmt.equals(parent.else)) {
					return CfgNodeType.ELSE;
				}
			}

			return CfgNodeType.SCOPE;
		}

		const left = $stmt.siblingsLeft;
		//println("NODE TYPE "+left)

		if(left.length > 0 ) {
			const lastLeft = left[left.length-1];

			const leftNodeType = CfgUtils.getNodeType(lastLeft);
			if(leftNodeType !== undefined && leftNodeType !== CfgNodeType.INST_LIST) {
				return CfgNodeType.INST_LIST;
			}
		}

		
		return undefined;
		//return CfgNodeType.UNDEFINED;
		//throw new Error(`_getNodeType() not defined for statements of type '${$stmt.joinPointType}'`);	
	}

}