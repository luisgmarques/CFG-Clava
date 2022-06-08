laraImport("clava.graphs.cfg.CfgNode")
laraImport("clava.graphs.cfg.CfgNodeType");

class InstListNodeData extends CfgNode {

    constructor($stmt) {
        super(CfgNodeType.INST_LIST);

        // Given statement is start of the list
        this.addStmt($stmt); 

        // Add non-leader statements corresponding to this list
        const rightNodes = $stmt.siblingsRight;

        for(const $right of rightNodes) {
            if(!CfgUtils.isLeader($right)) {
                this.addStmt($right);
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
