class HeaderData extends CfgNode {

    #stmt

    constructor($stmt, nodeType) {
        super(nodeType, $stmt)

        this.#stmt = $stmt

    }

	getStmt() {
		return this.#stmt;
	}

    toString() {
        return this.name + ": " + this.#stmt.code
    }

}