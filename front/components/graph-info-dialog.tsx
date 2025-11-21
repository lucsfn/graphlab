"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LogicalGraph } from "@/types/graph";
import { Badge } from "@/components/ui/badge";

interface GraphInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    graph: LogicalGraph;
}

export function GraphInfoDialog({
    open,
    onOpenChange,
    graph,
}: GraphInfoDialogProps) {
    const sortedNodes = [...graph.nodes].sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const sortedEdges = [...graph.edges].sort((a, b) => {
        const sourceCompare = a.source.localeCompare(b.source);
        if (sourceCompare !== 0) return sourceCompare;
        const targetCompare = a.target.localeCompare(b.target);
        if (targetCompare !== 0) return targetCompare;
        const weightA = a.weight ?? 0;
        const weightB = b.weight ?? 0;
        return weightA - weightB;
    });

    const nodeLabelMap = new Map(
        graph.nodes.map((node) => [node.id, node.label])
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Informações do Grafo</DialogTitle>
                    <DialogDescription>
                        Visualize detalhes sobre a estrutura do grafo atual.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Total de Nós
                            </p>
                            <p className="text-2xl font-bold">
                                {graph.nodes.length}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Total de Arestas
                            </p>
                            <p className="text-2xl font-bold">
                                {graph.edges.length}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            Nós ({sortedNodes.length})
                        </h3>
                        {sortedNodes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhum nó no grafo.
                            </p>
                        ) : (
                            <ScrollArea className="h-[240px] pr-4">
                                <div className="space-y-1">
                                    {sortedNodes.map((node, index) => (
                                        <div
                                            key={node.id}
                                            className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                                        >
                                            <Badge variant="outline" className="font-mono">
                                                {index + 1}
                                            </Badge>
                                            <span className="text-sm font-medium">
                                                {node.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                ID: {node.id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">
                            Arestas ({sortedEdges.length})
                        </h3>
                        {sortedEdges.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma aresta no grafo.
                            </p>
                        ) : (
                            <ScrollArea className="h-[240px] pr-4">
                                <div className="space-y-1">
                                    {sortedEdges.map((edge, index) => (
                                        <div
                                            key={edge.id}
                                            className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                                        >
                                            <Badge variant="outline" className="font-mono">
                                                {index + 1}
                                            </Badge>
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className="text-sm font-medium">
                                                    {nodeLabelMap.get(edge.source) ?? edge.source}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    →
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {nodeLabelMap.get(edge.target) ?? edge.target}
                                                </span>
                                                {edge.weight !== undefined && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-auto shrink-0"
                                                    >
                                                        Peso: {edge.weight}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

