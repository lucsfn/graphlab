"use client";

import { ReactNode } from "react";
import { useGraph } from "@/hooks/use-graph";
import { GraphContext } from "@/hooks/use-graph-context";

interface GraphProviderProps {
    children: ReactNode;
}

export function GraphProvider({ children }: GraphProviderProps) {
    const graphHook = useGraph();

    return (
        <GraphContext.Provider value={graphHook}>
            {children}
        </GraphContext.Provider>
    );
}
