export class BFS {
  static run(graph, params) {
    const start = params.start;
    const visited = new Set();
    const queue = [start];
    const steps = [];
    let edgeCount = 0;
    let path = [];
    let edgesInPath = [];
    let prev = {};

    while (queue.length) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      path.push(current);

      const frontier = queue.slice();
      steps.push({ visited: Array.from(visited), current, frontier });

      const neighbors = graph.adjacencyList.get(current) || [];
      neighbors.forEach((n) => {
        if (!visited.has(n.target)) {
          queue.push(n.target);
          edgeCount++;
          prev[n.target] = current;
        }
      });
    }

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
