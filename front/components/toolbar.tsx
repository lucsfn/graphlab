"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Zap, Pointer, PencilLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { AddNodeDialog } from "@/components/add-node-dialog";
import { useGraphContext } from "@/hooks/use-graph-context";

type InteractionMode = "select" | "edit";

interface ToolbarProps {
    mode: InteractionMode;
    onModeChange: (mode: InteractionMode) => void;
}

export function Toolbar({ mode, onModeChange }: ToolbarProps) {
    const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
    const {
        addNode,
        clearGraph,
        deleteNode,
        deleteEdge,
        selectedNodeIds,
        selectedEdgeIds,
    } = useGraphContext();

    const hasSelection =
        selectedNodeIds.length > 0 || selectedEdgeIds.length > 0;

    const handleAddNode = (label: string) => {
        // Add node at center of canvas
        addNode(label, { x: 250, y: 250 });
        toast.success("Nó adicionado com sucesso");
    };

    const handleDeleteSelected = useCallback(() => {
        selectedEdgeIds.forEach((edgeId) => deleteEdge(edgeId));
        selectedNodeIds.forEach((nodeId) => deleteNode(nodeId));
    }, [deleteEdge, deleteNode, selectedEdgeIds, selectedNodeIds]);

    return (
        <>
            <TooltipProvider>
                <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 backdrop-blur-sm shadow-lg dark:bg-card/90 dark:border-sidebar-border">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={
                                        mode === "select"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    size="icon"
                                    className="h-10 w-10 hover:bg-accent/50"
                                    aria-pressed={mode === "select"}
                                    onClick={() => onModeChange("select")}
                                >
                                    <Pointer className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Selecionar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={
                                        mode === "edit" ? "secondary" : "ghost"
                                    }
                                    size="icon"
                                    className="h-10 w-10 hover:bg-accent/50"
                                    aria-pressed={mode === "edit"}
                                    onClick={() => onModeChange("edit")}
                                >
                                    <PencilLine className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Editar rótulos e pesos
                            </TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Add Node */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 hover:bg-accent/50"
                                    onClick={() => setShowAddNodeDialog(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Adicionar Nó</TooltipContent>
                        </Tooltip>

                        {/* Delete */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 hover:bg-accent/50 hover:text-destructive disabled:opacity-50"
                                    onClick={handleDeleteSelected}
                                    disabled={!hasSelection}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Deletar Selecionado</TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Clear Graph */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 hover:bg-accent/50"
                                    onClick={clearGraph}
                                >
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Limpar Grafo</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </TooltipProvider>
            <AddNodeDialog
                open={showAddNodeDialog}
                onOpenChange={setShowAddNodeDialog}
                onAddNode={handleAddNode}
            />
        </>
    );
}
