class ScopeNodeData extends CfgNode {

    #scope;

    constructor($scope, nodeType=CfgNodeType.SCOPE) {
        super(nodeType, $scope)

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

    get scope() {
    		return this.#scope;
    }

    /*
    toString() {
		return this.name;
    }
    */



}