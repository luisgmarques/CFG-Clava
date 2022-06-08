laraImport("clava.graphs.cfg.CfgNodeType");
laraImport("clava.graphs.cfg.CfgNode");
laraImport("clava.graphs.cfg.nodedata.InstListNodeData");
laraImport("clava.graphs.cfg.nodedata.ScopeNodeData");

class DataFactory {

	static newData(cfgNodeType, $stmt) {
		if(cfgNodeType === CfgNodeType.INST_LIST) {
			return new InstListNodeData($stmt);
		}
		else if (cfgNodeType === CfgNodeType.SCOPE) {
			return new ScopeNodeData($stmt)
		}
			
		return new CfgNode(cfgNodeType, $stmt);		
	}

}