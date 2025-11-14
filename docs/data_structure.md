# Estrutura de Dados da Aplicação

Este documento descreve a estrutura de dados adotada pelo GraphLab para construção, visualização e execução de grafos. A especificação é totalmente agnóstica de linguagem, permitindo que o backend seja implementado em diferentes stacks (Node.js, C#, Python, etc.), mantendo o formato JSON como contrato oficial entre frontend e API.

---

## Modelo Visual no Frontend (React Flow)

O frontend utiliza o React Flow para renderização e manipulação visual de grafos. Essa camada é responsável apenas pela interface e não deve ser utilizada como representação lógica dos dados.

### Estrutura de Node no Frontend

```ts
type GraphNode = {
  id: string
  type?: string
  data: {
    label: string
  }
  position: {
    x: number
    y: number
  }
}
```

#### Características do Node Visual

- Mantém posição na tela.
- Armazena rótulos exibidos ao usuário.
- Não contém metadados algorítmicos.

---

### Estrutura de Edge no Frontend

```ts
type GraphEdge = {
  id: string
  source: string
  target: string
  label?: string
  data?: {
    weight?: number
  }
}
```

#### Características da Edge Visual

- O peso exibido é representado como label.
- O peso real é armazenado em `data.weight`.
- É uma estrutura puramente visual, dependente do React Flow.

---

### Estrutura Mantida no Estado Visual

```ts
type FlowGraphState = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

---

## Modelo Lógico no Frontend

O frontend converte o modelo visual em uma estrutura lógica antes de enviar o grafo para o backend. Essa separação garante consistência, facilita validações e evita dependência do React Flow.

### Estrutura do Grafo Lógico

```ts
type LogicalGraph = {
  nodes: {
    id: string
    label: string
  }[],
  edges: {
    id: string
    source: string
    target: string
    weight?: number
  }[],
  directed: boolean
}
```

### Conversão entre modelos

```ts
function convertFlowToLogical(flow: FlowGraphState): LogicalGraph {
  return {
    directed: false,
    nodes: flow.nodes.map(n => ({
      id: n.id,
      label: n.data.label
    })),
    edges: flow.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: e.data?.weight ?? null
    }))
  }
}
```

---

## Modelo de Dados para Execução de Algoritmos

O frontend envia para a API uma requisição contendo o grafo lógico e os parâmetros do algoritmo.

```json
{
  "graph": {
    "nodes": [...],
    "edges": [...],
    "directed": false
  },
  "algorithm": "dijkstra",
  "params": {
    "start": "A",
    "end": "F"
  }
}
```

### Detalhes dos Campos

- `graph` segue exatamente o modelo lógico.
- `algorithm` aceita valores como `"bfs"`, `"dfs"`, `"dijkstra"`.
- `params.start` identifica o nó inicial.
- `params.end` é utilizado quando o algoritmo requer destino.

---

## Estrutura de Dados no Backend

O backend transforma o grafo recebido em uma estrutura interna otimizada para execução dos algoritmos.

### Representação Interna do Grafo

```pseudo
type Graph:
    nodes: Set<NodeId>
    adjacencyList: Map<NodeId, List<Edge>>

type Edge:
    target: NodeId
    weight: Number | Null
```

#### Características da Estrutura Interna

- Acesso rápido aos vizinhos via `adjacencyList`.
- Suporta grafos ponderados e não ponderados.
- Para grafos não direcionados, duplicam-se as entradas.

---

### Conversão de JSON para Estrutura Interna

```pseudo
function parseGraph(jsonGraph):
    graph = new Graph()

    for each node in jsonGraph.nodes:
        graph.nodes.add(node.id)

    for each edge in jsonGraph.edges:
        graph.adjacencyList[edge.source].append(
            Edge(target=edge.target, weight=edge.weight)
        )

        if jsonGraph.directed is false:
            graph.adjacencyList[edge.target].append(
                Edge(target=edge.source, weight=edge.weight)
            )

    return graph
```

---

## Modelo de Resposta da API

A resposta deve conter tanto os passos do algoritmo quanto o resultado final.

```json
{
  "status": "success",
  "steps": [
    {
      "visited": ["A"],
      "current": "A",
      "frontier": ["B", "C"]
    },
    {
      "visited": ["A", "B"],
      "current": "B",
      "frontier": ["C", "D"]
    }
  ],
  "result": {
    "path": ["A", "B", "E", "F"],
    "distance": 12
  }
}
```

### Campos da Resposta

- `steps` contém o histórico para animação.
- `visited` são nós já explorados.
- `current` é o nó em análise.
- `frontier` representa fila, pilha ou prioridade.
- `result.path` contém o caminho mínimo quando aplicável.
- `result.distance` representa o custo total do caminho.

---

## Estrutura de Erros da API

```json
{
  "status": "error",
  "message": "Dijkstra não pode ser executado com pesos negativos.",
  "code": "INVALID_WEIGHT"
}
```

---

## Estrutura de Dados para Animação no Frontend

O frontend mantém um estado separado para controlar as animações.

### Estado da Animação

```ts
type AnimationState = {
  currentStepIndex: number
  steps: AlgorithmStep[]
  isPlaying: boolean
}
```

### Estrutura de um Passo

```ts
type AlgorithmStep = {
  visited: string[]
  current: string
  frontier?: string[]
}
```

#### Integração com React Flow

- `visited` e `current` são transformados em cores, bordas ou animações nos nós.
- `frontier` pode alterar o estilo de destaque ou animação das arestas.

---