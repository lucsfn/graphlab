export class GraphService {
  constructor() {}

  parseGraph(jsonGraph) {
    const { nodes = [], edges = [], directed = false } = jsonGraph;
    const graph = {
      nodes: new Set(),
      adjacencyList: new Map(),
      directed,
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

  runAlgorithm(jsonReq) {
    const { graph: jsonGraph, algorithm, params } = jsonReq;
    const graph = this.parseGraph(jsonGraph);

    if (algorithm === "bfs") return this._bfs(graph, params);
    if (algorithm === "dfs") return this._dfs(graph, params);
    if (algorithm === "dijkstra") return this._dijkstra(graph, params);

    throw { status: "error", message: "Algorithm not supported", code: "UNKNOWN_ALGO" };
  }

  _bfs(graph, params) {
    const start = params.start;
    const visited = new Set();
    const queue = [start];
    const steps = [];

    while (queue.length) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);

      const frontier = queue.slice();
      steps.push({ visited: Array.from(visited), current, frontier });

      const neighbors = graph.adjacencyList.get(current) || [];
      neighbors.forEach((n) => {
        if (!visited.has(n.target)) queue.push(n.target);
      });
    }

    return { status: "success", steps, result: { path: Array.from(visited) } };
  }

  _dfs(graph, params) {
    const start = params.start;
    const visited = new Set();
    const steps = [];

    const dfs = (node) => {
      if (visited.has(node)) return;
      visited.add(node);
      const frontier = graph.adjacencyList.get(node).map((n) => n.target);
      steps.push({ visited: Array.from(visited), current: node, frontier });
      graph.adjacencyList.get(node).forEach((n) => dfs(n.target));
    };

    dfs(start);

    return { status: "success", steps, result: { path: Array.from(visited) } };
  }

  _dijkstra(graph, params) {
    const start = params.start;
    const end = params.end;

    // initialize distances
    const dist = new Map();
    graph.nodes.forEach((n) => dist.set(n, Infinity));
    dist.set(start, 0);

    const prev = new Map();
    const pq = new Set(Array.from(graph.nodes));
    const steps = [];

    while (pq.size) {
      // extract min
      let u = null;
      let min = Infinity;
      for (const v of pq) {
        if (dist.get(v) < min) {
          min = dist.get(v);
          u = v;
        }
      }

      if (u === null) break;
      pq.delete(u);

      const frontier = Array.from(pq);
      steps.push({ visited: Array.from(new Set(Array.from(dist.keys()).filter(k => dist.get(k) !== Infinity))), current: u, frontier });

      if (u === end) break;

      const neighbors = graph.adjacencyList.get(u) || [];
      neighbors.forEach((nei) => {
        const alt = dist.get(u) + (nei.weight ?? 0);
        if (alt < dist.get(nei.target)) {
          dist.set(nei.target, alt);
          prev.set(nei.target, u);
        }
      });
    }

    // build path
    const path = [];
    let u = end;
    if (prev.has(u) || u === start) {
      while (u) {
        path.unshift(u);
        if (u === start) break;
        u = prev.get(u);
        if (u === undefined) break;
      }
    }

    const distance = dist.get(end);

    return { status: "success", steps, result: { path, distance } };
  }
}

export default new GraphService();
