laraImport("clava.graphs.cfg.CfgNodeData");

class HeaderData extends CfgNodeData {

    //#stmt

    constructor($stmt, nodeType) {
        super(nodeType, $stmt)

        //this.#stmt = $stmt

    }

    /*
	getStmt() {
		return this.#stmt;
	}
    */

    toString() {
        return this.name + ": " + this.nodeStmt.code;
    }

}