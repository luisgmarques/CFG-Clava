laraImport("clava.graphs.cfg.CfgBuilder");
laraImport("weaver.Query");

    for(var $function of Query.search("function")) {
		const cfg = CfgBuilder.buildGraph($function);
			println("Cfg for function at " + $function.location + " (you can use http://webgraphviz.com/ to test):");
			println(Graphs.toDot(cfg.graph));

		for(const node of cfg.graph.nodes()) {
			println("Node: " + node.data().type);
			println("Stmts: " + node.data().stmts);			
		}
    }
