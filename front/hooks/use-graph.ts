import { useCallback, useMemo, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { GraphNode, GraphEdge, LogicalGraph } from "@/types/graph";
import { nanoid } from "nanoid";

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
            const resolvedSourceHandle = sourceHandle ?? `${source}-out`;
            const resolvedTargetHandle = targetHandle ?? `${target}-in`;
            const newEdge: GraphEdge = {
                id: edgeId,
                source,
                target,
                sourceHandle: resolvedSourceHandle,
                targetHandle: resolvedTargetHandle,
                animated: true,
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
                nds.map((n) =>
                    n.id === nodeId ? { ...n, data: { label } } : n
                )
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
    };
}
