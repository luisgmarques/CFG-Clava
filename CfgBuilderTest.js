laraImport("clava.graphs.CfgBuilder");
laraImport("weaver.Query");

    for(var $function of Query.search("function")) {
		const cfg = CfgBuilder.buildGraph($function);
			println("Cfg for function at " + $function.location + " (you can use http://webgraphviz.com/ to test):");
			println(Graphs.toDot(cfg));

    }

