import { useCallback, useMemo, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { GraphNode, GraphEdge, LogicalGraph } from "@/types/graph";
import { nanoid } from "nanoid";

const defaultSourceHandleId = (nodeId: string) => `${nodeId}-out-bottom`;
const defaultTargetHandleId = (nodeId: string) => `${nodeId}-in-top`;

export function useGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  const addNode = useCallback(
    (label: string, position: { x: number; y: number }) => {
      const newNode: GraphNode = {
        id: nanoid(),
        data: { label },
        position,
        type: "custom",
      };
      setNodes((nds) => [...nds, newNode]);
      return newNode.id;
    },
    [setNodes]
  );

  const addEdge = useCallback(
    (
      source: string,
      target: string,
      weight?: number,
      sourceHandle?: string | null,
      targetHandle?: string | null
    ) => {
      const edgeId = nanoid();
      const resolvedSourceHandle =
        sourceHandle ?? defaultSourceHandleId(source);
      const resolvedTargetHandle =
        targetHandle ?? defaultTargetHandleId(target);
      const newEdge: GraphEdge = {
        id: edgeId,
        source,
        target,
        sourceHandle: resolvedSourceHandle,
        targetHandle: resolvedTargetHandle,
        type: "straight",
        animated: false,
        label: weight !== undefined ? `${weight}` : undefined,
        data: { weight },
      };
      setEdges((eds) => [...eds, newEdge]);
      return edgeId;
    },
    [setEdges]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges]
  );

  const updateNodeLabel = useCallback(
    (nodeId: string, label: string) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { label } } : n))
      );
    },
    [setNodes]
  );

  const updateEdgeWeight = useCallback(
    (edgeId: string, weight?: number) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? {
                ...e,
                label: weight ? `${weight}` : undefined,
                data: { weight },
              }
            : e
        )
      );
    },
    [setEdges]
  );

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
  }, [setNodes, setEdges]);

  const convertToLogical = useCallback((): LogicalGraph => {
    return {
      directed: false,
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        weight: e.data?.weight,
      })),
    };
  }, [nodes, edges]);

  const logicalGraph = useMemo(() => convertToLogical(), [convertToLogical]);
  const selectedNodes = useMemo(
    () => nodes.filter((node) => selectedNodeIds.includes(node.id)),
    [nodes, selectedNodeIds]
  );
  const selectedEdges = useMemo(
    () => edges.filter((edge) => selectedEdgeIds.includes(edge.id)),
    [edges, selectedEdgeIds]
  );

  const setSelection = useCallback((nodeIds: string[], edgeIds: string[]) => {
    setSelectedNodeIds(nodeIds);
    setSelectedEdgeIds(edgeIds);
  }, []);

  const highlightPath = useCallback(
    (path: string[]) => {
      setEdges((eds) => {
        // Descobrir todas as arestas do caminho mínimo
        const pathEdges = new Set<string>();
        for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];
          const edge = eds.find(
            (e) =>
              (e.source === from && e.target === to) ||
              (e.source === to && e.target === from)
          );
          if (edge) pathEdges.add(edge.id);
        }
        return eds.map((e) => {
          if (pathEdges.has(e.id)) {
            return {
              ...e,
              style: { ...e.style, stroke: "#ef4444", strokeWidth: 3 },
            };
          } else {
            // Volta ao padrão
            const { style, ...rest } = e;
            return { ...rest };
          }
        });
      });
    },
    [setEdges]
  );

  const highlightEdges = useCallback(
    (edgeIds: string[]) => {
      setEdges((eds) =>
        eds.map((e) =>
          edgeIds.includes(e.id)
            ? { ...e, style: { ...e.style, stroke: "#ef4444", strokeWidth: 3 } }
            : {
                ...e,
                style: {
                  ...e.style,
                  stroke: undefined,
                  strokeWidth: undefined,
                },
              }
        )
      );
    },
    [setEdges]
  );

  const generateRandomGraph = useCallback(
    (nodeCount: number, edgeCount: number) => {
      // Limpar grafo atual
      setNodes([]);
      setEdges([]);
      setSelectedNodeIds([]);
      setSelectedEdgeIds([]);

      // Gerar nós em círculo
      const newNodes: GraphNode[] = [];
      const radius = 200;
      const centerX = 400;
      const centerY = 300;

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i * 2 * Math.PI) / nodeCount;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        newNodes.push({
          id: nanoid(),
          data: { label: String.fromCharCode(65 + i) }, // A, B, C...
          position: { x, y },
          type: "custom",
        });
      }

      setNodes(newNodes);

      // Gerar arestas aleatórias
      const newEdges: GraphEdge[] = [];
      const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
      const actualEdgeCount = Math.min(edgeCount, maxPossibleEdges);
      const edgeSet = new Set<string>();

      while (newEdges.length < actualEdgeCount) {
        const sourceIdx = Math.floor(Math.random() * nodeCount);
        const targetIdx = Math.floor(Math.random() * nodeCount);

        if (sourceIdx === targetIdx) continue;

        const edgeKey = [sourceIdx, targetIdx].sort().join("-");
        if (edgeSet.has(edgeKey)) continue;

        edgeSet.add(edgeKey);
        const source = newNodes[sourceIdx].id;
        const target = newNodes[targetIdx].id;
        const weight = Math.floor(Math.random() * 20) + 1;

        newEdges.push({
          id: nanoid(),
          source,
          target,
          sourceHandle: defaultSourceHandleId(source),
          targetHandle: defaultTargetHandleId(target),
          type: "straight",
          animated: false,
          label: `${weight}`,
          data: { weight },
        });
      }

      setEdges(newEdges);
    },
    [setNodes, setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    addEdge,
    updateEdgeWeight,
    convertToLogical,
    clearGraph,
    deleteNode,
    deleteEdge,
    updateNodeLabel,
    logicalGraph,
    selectedNodeIds,
    selectedEdgeIds,
    selectedNodes,
    selectedEdges,
    setSelection,
    highlightPath,
    highlightEdges,
    setEdges,
    generateRandomGraph,
  };
}
