"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { GraphNode } from "@/types/graph";

export function CustomGraphNode({ data, id }: NodeProps<GraphNode>) {
    return (
        <div className="flex items-center justify-center">
            <Handle
                type="target"
                position={Position.Top}
                id={`${id}-in`}
                className="h-2.5! w-2.5! bg-primary! border-[3px]! border-card!"
            />
            <div
                className="node-body flex items-center justify-center rounded-full border-2 border-primary bg-card text-sm font-semibold text-foreground shadow-md hover:border-primary/80 hover:shadow-lg transition-all"
                style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                }}
            >
                {data.label}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id={`${id}-out`}
                className="h-2.5! w-2.5! bg-primary! border-[3px]! border-card!"
            />
        </div>
    );
}
