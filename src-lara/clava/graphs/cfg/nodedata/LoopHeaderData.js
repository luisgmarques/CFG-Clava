class LoopHeaderData extends CfgNode {

    #stmt

    constructor($stmt){
        super(CfgNodeType.LOOP_HEADER)

        this.#stmt = $stmt

    }

	getLoop() {
		return this.#stmt;
	}

    toString() {
        const kind = this.#stmt.kind

        return "LOOP_HEADER: " + kind
    }



}