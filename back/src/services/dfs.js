export class DFS {
  static run(graph, params) {
    const start = params.start;
    const visited = new Set();
    const steps = [];
    let edgeCount = 0;
    let path = [];
    let edgesInPath = [];
    let prev = {};

    const dfs = (node) => {
      if (visited.has(node)) return;
      visited.add(node);
      path.push(node);
      const frontier = graph.adjacencyList.get(node).map((n) => n.target);
      steps.push({ visited: Array.from(visited), current: node, frontier });
      graph.adjacencyList.get(node).forEach((n) => {
        if (!visited.has(n.target)) {
          edgeCount++;
          prev[n.target] = node;
        }
        dfs(n.target);
      });
    };

    dfs(start);

    if (graph._edgesList) {
      for (let i = 1; i < path.length; i++) {
        const from = prev[path[i]];
        const to = path[i];
        const edge = graph._edgesList.find(
          (e) =>
            (e.source === from && e.target === to) ||
            (e.source === to && e.target === from)
        );
        if (edge) edgesInPath.push(edge.id);
      }
    }

    return {
      status: "success",
      steps,
      result: {
        nodesVisited: visited.size,
        edgesVisited: edgeCount,
        path,
        edgesInPath,
      },
    };
  }
}
