"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { GraphNode } from "@/types/graph";

const handleClass =
  "h-2.5! w-2.5! bg-primary! border-[3px]! border-card! shadow-sm transition-colors";

export function CustomGraphNode({ data, id }: NodeProps<GraphNode>) {
  return (
    <div className="relative flex items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-in-top`}
        className={`${handleClass} -translate-y-1`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-in-left`}
        className={`${handleClass} -translate-x-1`}
      />
      <div
        className="node-body flex items-center justify-center rounded-full border-2 border-primary bg-card text-sm font-semibold text-foreground shadow-md transition-all hover:border-primary/80 hover:shadow-lg"
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
        position={Position.Right}
        id={`${id}-out-right`}
        className={`${handleClass} translate-x-1`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-out-bottom`}
        className={`${handleClass} translate-y-1`}
      />
    </div>
  );
}
