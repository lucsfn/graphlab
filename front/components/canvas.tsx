"use client";

import { useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function CanvasContent() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge(connection, eds));
        },
        [setEdges]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background />
            {/* TODO: We should fix the dark mode style for Controls component */}
            {/*<Controls /> */}
            <MiniMap />
        </ReactFlow>
    );
}

export function Canvas() {
    return (
        <div className="relative h-full w-full">
            <ReactFlowProvider>
                <CanvasContent />
            </ReactFlowProvider>
        </div>
    );
}
