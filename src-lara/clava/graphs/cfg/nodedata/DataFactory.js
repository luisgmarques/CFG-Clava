laraImport("clava.graphs.cfg.CfgNodeType");
laraImport("clava.graphs.cfg.CfgNode");
laraImport("clava.graphs.cfg.nodedata.InstListNodeData");
laraImport("clava.graphs.cfg.nodedata.ScopeNodeData");
laraImport("clava.graphs.cfg.nodedata.LoopHeaderData");
laraImport("clava.graphs.cfg.nodedata.HeaderData");
laraImport("clava.graphs.cfg.nodedata.IfData");

class DataFactory {

	static newData(cfgNodeType, $stmt) {
		if(cfgNodeType === CfgNodeType.INST_LIST) {
			return new InstListNodeData($stmt);
		}
		else if (cfgNodeType === CfgNodeType.SCOPE) {
			return new ScopeNodeData($stmt)
		}
		else if (cfgNodeType === CfgNodeType.LOOP_HEADER) {
			return new LoopHeaderData($stmt)
		}
		else if (cfgNodeType === CfgNodeType.COND) {
			return new HeaderData($stmt, cfgNodeType)
		}
		else if (cfgNodeType === CfgNodeType.STEP) {
			return new HeaderData($stmt, cfgNodeType)
		}
		else if (cfgNodeType === CfgNodeType.INIT) {
			return new HeaderData($stmt, cfgNodeType)
		}
		else if (cfgNodeType === CfgNodeType.THEN) {
			return new ScopeNodeData($stmt, cfgNodeType)
		}
		else if (cfgNodeType === CfgNodeType.ELSE) {
			return new ScopeNodeData($stmt, cfgNodeType)
		} else if (cfgNodeType === CfgNodeType.IF) {
			return new IfData($stmt)
		}
			
		return new CfgNode(cfgNodeType, $stmt);		
	}

}