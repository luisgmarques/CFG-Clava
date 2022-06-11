class IfData extends CfgNode {

    //#stmt

    constructor($stmt){
        super(CfgNodeType.IF, $stmt)

        //this.#stmt = $stmt

    }

	get if() {
		return this.nodeStmt;
        //return this.#stmt;
	}

    toString() {
        return "if(" + this.if.cond.code + ")";
    }



}