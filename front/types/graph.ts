import { Node, Edge } from "@xyflow/react";

// Visual Models
export type GraphNode = Node<{ label: string }>;

export type GraphEdge = Edge<{
    weight?: number;
}>;

export type FlowGraphState = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

// Logical Models
export type LogicalNode = {
    id: string;
    label: string;
};

export type LogicalEdge = {
    id: string;
    source: string;
    target: string;
    weight?: number;
};

export type LogicalGraph = {
    nodes: LogicalNode[];
    edges: LogicalEdge[];
    directed: boolean;
};

// Algorithm Models
export type AlgorithmRequest = {
    graph: LogicalGraph;
    algorithm: "bfs" | "dfs" | "dijkstra";
    params: {
        start: string;
        end?: string;
    };
};

export type AlgorithmStep = {
    visited: string[];
    current: string;
    frontier?: string[];
};

export type AlgorithmResponse = {
    status: "success" | "error";
    steps?: AlgorithmStep[];
    result?: {
        path: string[];
        distance?: number;
    };
    message?: string;
    code?: string;
};

export type GraphEditorState = {
    flowState: FlowGraphState;
    selectedNode: string | null;
    selectedEdge: string | null;
    isConnecting: boolean;
};
