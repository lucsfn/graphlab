"use client";

import * as React from "react";
import { useState } from "react";
import { Edit2, Zap, GitBranch, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AppLogo } from "@/components/app-logo";
import { NavSection } from "@/components/nav-section";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useGraphContext } from "@/hooks/use-graph-context";
import { AddNodeDialog } from "@/components/add-node-dialog";
import { AddEdgeDialog } from "@/components/add-edge-dialog";
import { GraphInfoDialog } from "@/components/graph-info-dialog";
import { EditNodeDialog } from "@/components/edit-node-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const {
        addNode,
        addEdge,
        clearGraph,
        logicalGraph,
        selectedNodes,
        updateNodeLabel,
    } = useGraphContext();

    const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
    const [showAddEdgeDialog, setShowAddEdgeDialog] = useState(false);
    const [showClearGraphDialog, setShowClearGraphDialog] = useState(false);
    const [showGraphInfoDialog, setShowGraphInfoDialog] = useState(false);
    const [showEditNodeDialog, setShowEditNodeDialog] = useState(false);
    const [editingNode, setEditingNode] = useState<{
        id: string;
        label: string;
    } | null>(null);

    const handleAddNode = (label: string) => {
        // Adicionar nó no centro do canvas (posição padrão será ajustada pelo React Flow)
        addNode(label, { x: 250, y: 250 });
        toast.success("Nó adicionado com sucesso");
    };

    const handleAddEdge = (source: string, target: string, weight: number) => {
        addEdge(source, target, weight);
        toast.success("Aresta adicionada com sucesso");
    };

    const handleClearGraph = () => {
        clearGraph();
        toast.success("Grafo limpo com sucesso");
        setShowClearGraphDialog(false);
    };

    const handleOpenEditNode = () => {
        if (selectedNodes.length === 0) {
            toast.info("Selecione um nó para editar");
            return;
        }
        const node = selectedNodes[0];
        setEditingNode({
            id: node.id,
            label: typeof node.data?.label === "string" ? node.data.label : "",
        });
        setShowEditNodeDialog(true);
    };

    const handleSaveNodeLabel = (label: string) => {
        if (!editingNode) return;
        updateNodeLabel(editingNode.id, label);
        toast.success("Rótulo atualizado com sucesso");
        setShowEditNodeDialog(false);
        setEditingNode(null);
    };

    const graphSection = [
        {
            title: "Operações",
            url: "#",
            icon: Edit2,
            isActive: true,
            items: [
                {
                    title: "Adicionar Nó",
                    url: "#",
                    onClick: () => setShowAddNodeDialog(true),
                },
                {
                    title: "Adicionar Aresta",
                    url: "#",
                    onClick: () => setShowAddEdgeDialog(true),
                },
                {
                    title: "Editar Nó",
                    url: "#",
                    onClick: handleOpenEditNode,
                },
                {
                    title: "Limpar Grafo",
                    url: "#",
                    onClick: () => setShowClearGraphDialog(true),
                },
            ],
        },
        {
            title: "Visualização",
            url: "#",
            icon: MapPin,
            items: [
                {
                    title: "Informações do Grafo",
                    url: "#",
                    onClick: () => setShowGraphInfoDialog(true),
                },
                {
                    title: "Nós Visitados",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar visualização de nós visitados
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
                {
                    title: "Arestas Visitadas",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar visualização de arestas visitadas
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
                {
                    title: "Resetar Visualização",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar reset de visualização
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
            ],
        },
    ];

    const algorithmSection = [
        {
            title: "Busca",
            url: "#",
            icon: Zap,
            items: [
                {
                    title: "BFS (Largura)",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar algoritmo BFS
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
                {
                    title: "DFS (Profundidade)",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar algoritmo DFS
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
            ],
        },
        {
            title: "Caminho Mínimo",
            url: "#",
            icon: GitBranch,
            isActive: true,
            items: [
                {
                    title: "Dijkstra",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar algoritmo Dijkstra
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
                {
                    title: "Calcular Caminho",
                    url: "#",
                    onClick: () => {
                        // TODO: Implementar cálculo de caminho mínimo
                        toast.info("Funcionalidade em desenvolvimento");
                    },
                },
            ],
        }
    ];

    return (
        <>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <AppLogo collapsed={isCollapsed} />
                </SidebarHeader>
                <SidebarContent>
                    <NavSection title="Grafo" items={graphSection} />
                    <NavSection title="Algoritmos" items={algorithmSection} />
                </SidebarContent>
                {/* <SidebarFooter>
                    <ModeToggle />
                </SidebarFooter> */}
                <SidebarRail />
            </Sidebar>
            <AddNodeDialog
                open={showAddNodeDialog}
                onOpenChange={setShowAddNodeDialog}
                onAddNode={handleAddNode}
            />
            <AddEdgeDialog
                open={showAddEdgeDialog}
                onOpenChange={setShowAddEdgeDialog}
                onAddEdge={handleAddEdge}
                availableNodes={logicalGraph.nodes}
            />
            <AlertDialog
                open={showClearGraphDialog}
                onOpenChange={setShowClearGraphDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Limpar Grafo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja limpar todo o grafo? Esta
                            ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearGraph}>
                            Limpar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <GraphInfoDialog
                open={showGraphInfoDialog}
                onOpenChange={setShowGraphInfoDialog}
                graph={logicalGraph}
            />
            <EditNodeDialog
                key={editingNode?.id ?? "sidebar-node"}
                open={showEditNodeDialog}
                onOpenChange={(open) => {
                    setShowEditNodeDialog(open);
                    if (!open) {
                        setEditingNode(null);
                    }
                }}
                initialLabel={editingNode?.label ?? ""}
                onSubmit={handleSaveNodeLabel}
            />
        </>
    );
}
