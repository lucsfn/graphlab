import { GraphParser } from "./parseGraph.js";
import { BFS } from "./bfs.js";
import { DFS } from "./dfs.js";
import { Dijkstra } from "./dijkstra.js";

export class GraphService {
  constructor() {}

  parseGraph(jsonGraph) {
    return GraphParser.parse(jsonGraph);
  }

  runAlgorithm(jsonReq) {
    const { graph: jsonGraph, algorithm, params } = jsonReq;
    const graph = this.parseGraph(jsonGraph);

    if (algorithm === "bfs") return BFS.run(graph, params);
    if (algorithm === "dfs") return DFS.run(graph, params);
    if (algorithm === "dijkstra") return Dijkstra.run(graph, params);

    throw {
      status: "error",
      message: "Algorithm not supported",
      code: "UNKNOWN_ALGO",
    };
  }

  bfs(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return BFS.run(graph, params);
  }

  dfs(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return DFS.run(graph, params);
  }

  dijkstra(jsonGraph, params) {
    const graph = this.parseGraph(jsonGraph);
    return Dijkstra.run(graph, params);
  }
}

const graphServiceInstance = new GraphService();
export default graphServiceInstance;
