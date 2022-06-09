class ScopeNodeData extends CfgNode {

    #scope;

    constructor($scope, nodeType=CfgNodeType.SCOPE) {
        super(nodeType)

        isJoinPoint($scope, "scope");   

        this.#scope = $scope;

		// This is just a marker node, so it has no statements
		/*
        for(const $stmt of $scope.stmts) {
            if(!CfgUtils.isLeader($stmt)) {
                this.addStmt($stmt);
            } else {
                break;
            }            
        }
        */

    }

    getScope() {
    		return this.#scope;
    }

    toString() {
    	   return "Scope";
    	   /*
        let code = "";

        for(const $stmt of this.getStmts()) {
            code += $stmt.code + "\n";
        }

        return code;
        */
    }



}