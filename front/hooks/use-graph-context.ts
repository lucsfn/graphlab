import { createContext, useContext } from "react";
import { useGraph } from "@/hooks/use-graph";

type GraphContextType = ReturnType<typeof useGraph>;

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function useGraphContext() {
    const context = useContext(GraphContext);
    if (!context) {
        throw new Error("useGraphContext must be used within GraphProvider");
    }
    return context;
}

export { GraphContext };
