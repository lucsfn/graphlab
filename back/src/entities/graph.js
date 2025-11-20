export class GraphEntity {
  constructor({ nodes = [], edges = [], directed = false } = {}) {
    this.nodes = new Set();
    this.adjacencyList = new Map();
    this.directed = directed;

    nodes.forEach((n) => this.addNode(n.id ?? n));
    edges.forEach((e) => this.addEdge(e));
  }

  addNode(nodeId) {
    if (!this.nodes.has(nodeId)) {
      this.nodes.add(nodeId);
      this.adjacencyList.set(nodeId, []);
    }
  }

  addEdge(edge) {
    const { source, target, weight = null } = edge;
    if (!this.nodes.has(source)) this.addNode(source);
    if (!this.nodes.has(target)) this.addNode(target);

    this.adjacencyList.get(source).push({ target, weight });
    if (!this.directed) {
      this.adjacencyList.get(target).push({ target: source, weight });
    }
  }

  getNeighbors(nodeId) {
    return this.adjacencyList.get(nodeId) || [];
  }
}
