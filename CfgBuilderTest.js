laraImport("clava.graphs.cfg.CfgBuilder");
laraImport("clava.graphs.cfg.CfgUtils");
laraImport("clava.graphs.cfg.CfgEdgeType");
laraImport("weaver.Query");

    for(var $function of Query.search("function")) {
		const functionCodeBefore = $function.code;
    	
		const cfg = CfgBuilder.buildGraph($function);
			println("Cfg for function at " + $function.location + " (you can use http://webgraphviz.com/ to test):");
			println(Graphs.toDot(cfg.graph));

		const functionCodeAfter = $function.code;

		if(functionCodeBefore !== functionCodeAfter){
			throw new Error("Code has changed!\n" + functionCodeAfter);
		}

		for(const node of cfg.graph.nodes()) {
			/*
			println("Node type :" + node.data().type);
			const targetTrue = CfgUtils.getTarget(node, CfgEdgeType.TRUE);
			if(targetTrue !== undefined) println("Target true: " + targetTrue.data())
			const targetFalse = CfgUtils.getTarget(node, CfgEdgeType.FALSE);
			if(targetFalse !== undefined) println("Target false: " + targetFalse.data())
			const targetUncond = CfgUtils.getTarget(node, CfgEdgeType.UNCONDITIONAL);			
			if(targetUncond !== undefined) println("Target uncond: " + targetUncond.data())			
			*/
			

			// Verify if all stmts have a mapping in nodes
			for(const stmt of node.data().stmts) {
				const graphNode= cfg.getNode(stmt);
				if(graphNode === undefined) {
					println("Stmt "+stmt.astId+" " + stmt.joinPointType + "@" + stmt.location + " does not have a graph node");
					continue;
				}

				if(!node.equals(graphNode)) {
					println("Stmt " + stmt.joinPointType + "@" + stmt.location + " has a graph node but is not the same");
					continue;
				}
			}
		}


/*

		for(const key of cfg.nodes.keys()) {
			//println("Key: " + key);
			const node = cfg.nodes.get(key);
			//println("Node stmts: " + node.data().stmts.map(stmt => stmt.astId));

			if(key.startsWith("stmt_")) {
				println("Stmts: " + node.data().stmts.map(stmt => stmt.code));
			}
		}
 */
    }
