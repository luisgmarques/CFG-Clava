class IfData extends CfgNode {

    #stmt

    constructor($stmt){
        super(CfgNodeType.IF)

        this.#stmt = $stmt

    }

	getIf() {
		return this.#stmt;
	}

    toString() {
        return "IF: " + this.#stmt.cond.code;
    }



}