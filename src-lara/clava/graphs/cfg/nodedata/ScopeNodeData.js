class ScopeNodeData extends CfgNode {

    #scope;

    constructor($scope, nodeType=CfgNodeType.SCOPE) {
        super(nodeType)

        isJoinPoint($scope, "scope");   

        this.#scope = $scope;

        for(const $stmt of $scope.stmts) {
            if(!CfgUtils.isLeader($stmt)) {
                this.addStmt($stmt);
            } else {
                break;
            }            
        }

    }

    toString() {
        let code = "";

        for(const $stmt of this.getStmts()) {
            code += $stmt.code + "\n";
        }

        return code;
    }



}