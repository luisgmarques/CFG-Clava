laraImport("clava.graphs.CfgNodeType");

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
		if($stmt.instanceOf("body")) {
			return CfgNodeType.BODY;
		}
		
		// Scope stmt
		if($stmt.instanceOf("scope")) {
			return CfgNodeType.SCOPE;
		}
				
		//return CfgNodeType.UNDEFINED;
		//throw new Error(`_getNodeType() not defined for statements of type '${$stmt.joinPointType}'`);	
	}

}