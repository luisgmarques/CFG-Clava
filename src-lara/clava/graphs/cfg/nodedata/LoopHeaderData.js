class LoopHeaderData extends CfgNode {

    //#stmt

    constructor($stmt){
        super(CfgNodeType.LOOP_HEADER, $stmt)

        //this.#stmt = $stmt

    }

	get loop() {
		return this.nodeStmt;
	}

    toString() {
        return "Loop: " + this.loop.kind;
    }


}