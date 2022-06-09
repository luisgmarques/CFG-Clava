class HeaderData extends CfgNode {

    #stmt

    constructor($stmt, nodeType) {
        super(nodeType)

        this.#stmt = $stmt

    }

    toString() {
        return this.#stmt.code
    }

}