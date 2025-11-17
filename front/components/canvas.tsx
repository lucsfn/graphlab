"use client";

import { useCallback, useState, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Connection,
    EdgeMouseHandler,
    type OnSelectionChangeParams,
    type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGraphContext } from "@/hooks/use-graph-context";
import { CustomGraphNode } from "@/components/graph-node";
import { EdgeWeightDialog } from "@/components/edge-weight-dialog";
import { Toolbar } from "@/components/toolbar";
import { EditNodeDialog } from "./edit-node-dialog";
import { useTheme } from "next-themes";
import type { GraphNode, GraphEdge } from "@/types/graph";
type InteractionMode = "select" | "edit";

const nodeTypes = {
    custom: CustomGraphNode,
};

function CanvasContent() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        addEdge,
        updateEdgeWeight,
        setSelection,
        updateNodeLabel,
        selectedNodeIds,
        deleteNode,
    } = useGraphContext();
    const { resolvedTheme } = useTheme();
    const [showWeightDialog, setShowWeightDialog] = useState(false);
    const [pendingConnection, setPendingConnection] =
        useState<Connection | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [interactionMode, setInteractionMode] =
        useState<InteractionMode>("select");
    const [nodeToEdit, setNodeToEdit] = useState<{
        id: string;
        label: string;
    } | null>(null);
    const [showEditNodeDialog, setShowEditNodeDialog] = useState(false);

    const colorMode = resolvedTheme === "dark" ? "dark" : "light";

    const onConnect = useCallback((connection: Connection) => {
        if (connection.source && connection.target) {
            setPendingConnection(connection);
            setShowWeightDialog(true);
        }
    }, []);

    const handleSetWeight = useCallback(
        (weight: number) => {
            if (pendingConnection?.source && pendingConnection?.target) {
                addEdge(
                    pendingConnection.source,
                    pendingConnection.target,
                    weight,
                    pendingConnection.sourceHandle ?? undefined,
                    pendingConnection.targetHandle ?? undefined
                );
                setPendingConnection(null);
            } else if (selectedEdgeId) {
                updateEdgeWeight(selectedEdgeId, weight);
                setSelectedEdgeId(null);
            }
        },
        [pendingConnection, selectedEdgeId, addEdge, updateEdgeWeight]
    );

    const handleEdgeClick: EdgeMouseHandler = useCallback(
        (event, edge) => {
            if (interactionMode !== "edit") {
                return;
            }
            event.stopPropagation();
            setSelectedEdgeId(edge.id);
            setPendingConnection(null);
            setShowWeightDialog(true);
        },
        [interactionMode]
    );

    const handleNodeClick: NodeMouseHandler = useCallback(
        (event, node) => {
            if (interactionMode === "select") {
                return;
            }
            event.stopPropagation();
            setNodeToEdit({
                id: node.id,
                label:
                    typeof node.data?.label === "string" ? node.data.label : "",
            });
            setShowEditNodeDialog(true);
        },
        [interactionMode]
    );

    const handleNodeDoubleClick: NodeMouseHandler = useCallback(
        (event, node) => {
            event.stopPropagation();
            setSelection([node.id], []);
            setNodeToEdit({
                id: node.id,
                label:
                    typeof node.data?.label === "string" ? node.data.label : "",
            });
            setShowEditNodeDialog(true);
        },
        [setSelection]
    );

    const handleSelectionChange = useCallback(
        (
            params:
                | OnSelectionChangeParams<GraphNode, GraphEdge>
                | null
                | undefined
        ) => {
            const selectedNodes = params?.nodes ?? [];
            const selectedEdges = params?.edges ?? [];
            setSelection(
                selectedNodes.map((node) => node.id),
                selectedEdges.map((edge) => edge.id)
            );
        },
        [setSelection]
    );

    const handleNodeLabelSave = useCallback(
        (newLabel: string) => {
            if (!nodeToEdit) return;
            updateNodeLabel(nodeToEdit.id, newLabel);
            setNodeToEdit(null);
            setShowEditNodeDialog(false);
        },
        [nodeToEdit, updateNodeLabel]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Delete" && event.key !== "Backspace") return;
            if (selectedNodeIds.length === 0) return;

            event.preventDefault();
            selectedNodeIds.forEach((nodeId) => deleteNode(nodeId));
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNodeIds, deleteNode]);

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={handleEdgeClick}
                onNodeClick={handleNodeClick}
                onNodeDoubleClick={handleNodeDoubleClick}
                onSelectionChange={handleSelectionChange}
                nodeTypes={nodeTypes}
                colorMode={colorMode}
                fitView
            >
                <Background />
                {/* <MiniMap /> */}
            </ReactFlow>
            <Toolbar mode={interactionMode} onModeChange={setInteractionMode} />
            <EdgeWeightDialog
                open={showWeightDialog}
                onOpenChange={(open) => {
                    setShowWeightDialog(open);
                    if (!open) {
                        setPendingConnection(null);
                        setSelectedEdgeId(null);
                    }
                }}
                onSetWeight={handleSetWeight}
                defaultWeight={
                    selectedEdgeId
                        ? edges.find((e) => e.id === selectedEdgeId)?.data
                              ?.weight
                        : undefined
                }
            />
            <EditNodeDialog
                key={nodeToEdit?.id ?? "no-node"}
                open={showEditNodeDialog}
                onOpenChange={(open) => {
                    setShowEditNodeDialog(open);
                    if (!open) {
                        setNodeToEdit(null);
                    }
                }}
                initialLabel={nodeToEdit?.label ?? ""}
                onSubmit={handleNodeLabelSave}
            />
        </>
    );
}

export function Canvas() {
    return (
        <div className="relative h-full w-full">
            <CanvasContent />
        </div>
    );
}
