/**
 * Enumeration of CFG node types.
 */
class CfgNodeType {
	
	static START = new CfgNodeType("START")
	static END = new CfgNodeType("END")
	static IF = new CfgNodeType("IF")
	static THEN = new CfgNodeType("THEN")
	static ELSE = new CfgNodeType("ELSE")		
	static FOR = new CfgNodeType("FOR")
	static SCOPE = new CfgNodeType("SCOPE")
	static INST_LIST = new CfgNodeType("INST_LIST")	
	static BODY = new CfgNodeType("BODY")
	static SCOPE_START = new CfgNodeType("SCOPE_START")
	static SCOPE_END = new CfgNodeType("SCOPE_END")
	static FOR_END = new CfgNodeType("FOR_END")
	static FOR_START = new CfgNodeType("FOR_START")
	static IF_END = new CfgNodeType("IF_END")
	static IF_START = new CfgNodeType("IF_START")
	//static UNDEFINED = new CfgNodeType("UNDEFINED")	
	
	#name;
	
	constructor(name) {
	    this.#name = name;
	}
	
	get name() {
		return this.#name;
	}
}