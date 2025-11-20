export class GraphService {
  constructor() {}

  parseGraph(jsonGraph) {
    const { nodes = [], edges = [], directed = false } = jsonGraph;
    const graph = {
      nodes: new Set(),
      adjacencyList: new Map(),
      directed,
      _edgesList: edges, // manter referência para busca de id
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

  bfs(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return this._bfs(graph, params);
  }

  dfs(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return this._dfs(graph, params);
  }

  dijkstra(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return this._dijkstra(graph, params);
  }

  _bfs(graph, params) {
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

    // Calcular edgesInPath
    if (graph._edgesList) {
      for (let i = 1; i < path.length; i++) {
        const from = prev[path[i]];
        const to = path[i];
        const edge = graph._edgesList.find(
          (e) => (e.source === from && e.target === to) || (e.source === to && e.target === from)
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

  _dfs(graph, params) {
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

    // Calcular edgesInPath
    if (graph._edgesList) {
      for (let i = 1; i < path.length; i++) {
        const from = prev[path[i]];
        const to = path[i];
        const edge = graph._edgesList.find(
          (e) => (e.source === from && e.target === to) || (e.source === to && e.target === from)
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

    // Novo: calcular as arestas do caminho mínimo
    let edgesInPath = [];
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      // Procurar a aresta correspondente
      const edge = (graph._edgesList || []).find(
        (e) => (e.source === from && e.target === to) || (e.source === to && e.target === from)
      );
      if (edge) edgesInPath.push(edge.id);
    }

    return {
      status: "success",
      steps,
      result: {
        pathLength: path.length,
        distance,
        path,
        edgesInPath,
      },
    };
  }
}

const graphServiceInstance = new GraphService();
export default graphServiceInstance;
