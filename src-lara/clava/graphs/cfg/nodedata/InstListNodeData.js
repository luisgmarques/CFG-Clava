laraImport("clava.graphs.cfg.CfgNodeData");
laraImport("clava.graphs.cfg.CfgNodeType");
laraImport("clava.graphs.cfg.CfgUtils");

class InstListNodeData extends CfgNodeData {

	#stmts;

    constructor($stmt) {
        super(CfgNodeType.INST_LIST, $stmt);

        this.#stmts = [];

        // Given statement is start of the list
        this.#stmts.push($stmt); 

        // Add non-leader statements corresponding to this list
        const rightNodes = $stmt.siblingsRight;

        for(const $right of rightNodes) {
            if(!CfgUtils.isLeader($right)) {
                this.#stmts.push($right);
            } else {
                break;
            }
        }

    }

    get stmts() {
        return this.#stmts;
    }

    getLastStmt() {
        return this.#stmts[this.#stmts.length-1];
    }

    /**
     * Returns all the statements of this instruction list.
     */
    get stmts() {
		return this.stmts;
	}

    toString() {
        let code = "";

        for(const $stmt of this.#stmts) {
            code += $stmt.code + "\n";
        }

        return code;
    }

}
