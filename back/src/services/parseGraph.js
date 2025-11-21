export class GraphParser {
  static parse(jsonGraph) {
    const { nodes = [], edges = [], directed = false } = jsonGraph;
    const graph = {
      nodes: new Set(),
      adjacencyList: new Map(),
      directed,
      _edgesList: edges,
    };

    nodes.forEach((n) => {
      graph.nodes.add(n.id);
      graph.adjacencyList.set(n.id, []);
    });

    edges.forEach((e) => {
      const weight = e.weight ?? null;
      if (!graph.adjacencyList.has(e.source)) {
        graph.nodes.add(e.source);
        graph.adjacencyList.set(e.source, []);
      }
      if (!graph.adjacencyList.has(e.target)) {
        graph.nodes.add(e.target);
        graph.adjacencyList.set(e.target, []);
      }

      graph.adjacencyList.get(e.source).push({ target: e.target, weight });
      if (!directed) {
        graph.adjacencyList.get(e.target).push({ target: e.source, weight });
      }
    });

    return graph;
  }
}
