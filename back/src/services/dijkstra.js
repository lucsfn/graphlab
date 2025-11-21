export class Dijkstra {
  static run(graph, params) {
    const start = params.start;
    const end = params.end;

    console.log("\n=== Dijkstra Input ===");
    console.log("Nós do grafo:", Array.from(graph.nodes));
    console.log("Lista de adjacências:");
    for (const [node, neighbors] of graph.adjacencyList.entries()) {
      console.log(`  ${node}:`, neighbors);
    }
    console.log("Parâmetros:", { start, end });
    console.log("=====================\n");

    // --- Validações ---
    if (!start || !end) {
      return {
        status: "error",
        message: "Informe nós de início e fim para executar Dijkstra.",
        code: "MISSING_NODES",
      };
    }
    if (start === end) {
      return {
        status: "error",
        message: "Os nós de início e fim devem ser diferentes.",
        code: "INVALID_RANGE",
      };
    }
    if (!graph.nodes.has(start)) {
      return {
        status: "error",
        message: "Nó de origem não existe no grafo.",
        code: "INVALID_START",
      };
    }
    if (!graph.nodes.has(end)) {
      return {
        status: "error",
        message: "Nó de destino não existe no grafo.",
        code: "INVALID_END",
      };
    }

    // Validação de pesos negativos
    for (const [node, neighbors] of graph.adjacencyList.entries()) {
      for (const neighbor of neighbors) {
        if (neighbor.weight !== null && neighbor.weight < 0) {
          return {
            status: "error",
            message: "Dijkstra não pode ser executado com pesos negativos.",
            code: "INVALID_WEIGHT",
          };
        }
      }
    }

    // --- Inicialização ---
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const pq = [];

    graph.nodes.forEach((nodeId) => {
      distances.set(nodeId, Infinity);
      previous.set(nodeId, null);
    });

    distances.set(start, 0);
    pq.push({ id: start, dist: 0 });

    const steps = [];

    // --- LOOP PRINCIPAL (CORRIGIDO) ---
    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);

      const { id: currentNodeId } = pq.shift();

      // 1. Verifica se já visitou para evitar reprocessamento
      if (visited.has(currentNodeId)) continue;

      // 2. Marca como visitado IMEDIATAMENTE
      visited.add(currentNodeId);

      // 3. Registra o passo (para debug/visualização)
      const frontier = pq.slice(0, Math.min(5, pq.length)).map((n) => n.id);
      steps.push({
        visited: Array.from(visited),
        current: currentNodeId,
        frontier: frontier,
      });

      // 4. Verifica condições de parada (DEPOIS de registrar)
      if (distances.get(currentNodeId) === Infinity) break;
      if (end && currentNodeId === end) break;

      // 5. Relaxamento (Processar vizinhos)
      const neighbors = graph.adjacencyList.get(currentNodeId) || [];

      for (const neighbor of neighbors) {
        const neighborId = neighbor.target;
        const weight =
          neighbor.weight !== null && neighbor.weight !== undefined
            ? neighbor.weight
            : 1;

        if (visited.has(neighborId)) continue;

        const newDist = distances.get(currentNodeId) + weight;

        if (newDist < distances.get(neighborId)) {
          distances.set(neighborId, newDist);
          previous.set(neighborId, currentNodeId);
          pq.push({ id: neighborId, dist: newDist });
        }
      }
    }

    // --- Reconstrução do Caminho ---
    let path = [];
    let edgesInPath = [];
    let distance = null;

    if (end) {
      if (distances.get(end) === Infinity) {
        return {
          status: "error",
          message: "Não existe caminho entre os nós selecionados.",
          code: "NO_PATH",
        };
      }

      let current = end;
      while (current !== null) {
        path.unshift(current);
        current = previous.get(current);
        if (current === undefined) break;
      }

      if (path[0] !== start) {
        return {
          status: "error",
          message: "Não existe caminho entre os nós selecionados.",
          code: "NO_PATH",
        };
      }

      distance = distances.get(end);

      const allEdges = graph._edgesList || [];

      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];

        const edge = allEdges.find(
          (e) =>
            (e.source === from && e.target === to) ||
            (!graph.directed && e.source === to && e.target === from)
        );
        if (edge) edgesInPath.push(edge.id);
      }
    }

    // --- Output Logs ---
    console.log("\n=== Dijkstra Output ===");
    console.log("Nós visitados:", Array.from(visited));
    console.log("Total de nós visitados:", visited.size);
    if (end) {
      console.log("Caminho mínimo até destino:", path);
      console.log("Distância até destino:", distance);
      console.log("Arestas do caminho:", edgesInPath);
    }
    console.log("Todas as distâncias mínimas calculadas:");
    for (const [node, dist] of distances.entries()) {
      console.log(`  ${node}: ${dist === Infinity ? "∞" : dist}`);
    }
    console.log("=======================\n");

    return {
      status: "success",
      steps,
      result: {
        nodesVisited: visited.size,
        allDistances: Object.fromEntries(distances),
        path: end ? path : undefined,
        pathLength: end ? path.length : undefined,
        distance: end && Number.isFinite(distance) ? distance : null,
        edgesInPath: end ? edgesInPath : undefined,
      },
    };
  }
}
