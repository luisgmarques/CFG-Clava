class HeaderData extends CfgNode {

    #stmt

    constructor($stmt, nodeType) {
        super(nodeType)

        this.#stmt = $stmt

    }

	getStmt() {
		return this.#stmt;
	}

    toString() {
        return this.name + ": " + this.#stmt.code
    }

}