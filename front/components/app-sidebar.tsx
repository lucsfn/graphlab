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
import { RandomGraphDialog } from "@/components/random-graph-dialog";
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
import { runBFS, runDFS, runDijkstra } from "@/lib/api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { highlightPath, highlightEdges, edges, setEdges, ...graphCtx } =
    useGraphContext();
  const {
    addNode,
    addEdge,
    clearGraph,
    logicalGraph,
    selectedNodes,
    updateNodeLabel,
    generateRandomGraph,
  } = graphCtx;

  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [showAddEdgeDialog, setShowAddEdgeDialog] = useState(false);
  const [showClearGraphDialog, setShowClearGraphDialog] = useState(false);
  const [showGraphInfoDialog, setShowGraphInfoDialog] = useState(false);
  const [showEditNodeDialog, setShowEditNodeDialog] = useState(false);
  const [showRandomGraphDialog, setShowRandomGraphDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<{
    id: string;
    label: string;
  } | null>(null);
  // Estado para visualização
  const [lastResult, setLastResult] = useState<any>(null);

  const handleAddNode = (label: string) => {
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

  const handleGenerateRandomGraph = (nodeCount: number, edgeCount: number) => {
    generateRandomGraph(nodeCount, edgeCount);
    toast.success(
      `Grafo aleatório gerado com ${nodeCount} nós e ${edgeCount} arestas`
    );
  };

  const handleRunAlgorithm = async (
    algorithm: "bfs" | "dfs" | "dijkstra",
    params: { start: string; end?: string }
  ) => {
    try {
      const req = {
        graph: logicalGraph,
        algorithm,
        params,
      };
      let res;
      if (algorithm === "bfs") {
        res = await runBFS(req);
      } else if (algorithm === "dfs") {
        res = await runDFS(req);
      } else if (algorithm === "dijkstra") {
        res = await runDijkstra(req);
      } else {
        toast.error("Algoritmo não suportado");
        return;
      }
      setLastResult(res.result);
      if (res.status === "success") {
        let msg = "";
        if (
          (algorithm === "bfs" || algorithm === "dfs") &&
          res.result?.edgesInPath
        ) {
          // Destacar arestas de busca em amarelo
          setEdges((eds) =>
            eds.map((e) =>
              res.result?.edgesInPath?.includes(e.id)
                ? {
                    ...e,
                    style: { ...e.style, stroke: "#facc15", strokeWidth: 3 },
                  }
                : {
                    ...e,
                    style: {
                      ...e.style,
                      stroke: undefined,
                      strokeWidth: undefined,
                    },
                  }
            )
          );
          msg = `Busca realizada! Nós visitados: ${res.result?.nodesVisited}`;
        } else if (algorithm === "dijkstra" && res.result?.edgesInPath) {
          // Destacar caminho mínimo em vermelho
          highlightEdges(res.result.edgesInPath);
          msg = `Caminho mínimo encontrado! Custo: ${res.result.distance}`;
        } else {
          msg = "Algoritmo executado com sucesso";
        }
        toast.success(msg);
      } else {
        toast.error(res.message || "Erro ao executar algoritmo");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro de comunicação com o backend");
    }
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
          title: "Gerar Grafo Aleatório",
          url: "#",
          onClick: () => setShowRandomGraphDialog(true),
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
          title: "Resetar Visualização",
          url: "#",
          onClick: () => {
            setLastResult(null);
            setEdges((eds) =>
              eds.map((e) => ({
                ...e,
                style: {
                  ...e.style,
                  stroke: undefined,
                  strokeWidth: undefined,
                },
              }))
            );
            toast.success("Visualização resetada");
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
          onClick: async () => {
            if (!logicalGraph.nodes.length) {
              toast.info("Adicione nós ao grafo primeiro");
              return;
            }
            const start = logicalGraph.nodes[0].id;
            await handleRunAlgorithm("bfs", { start });
          },
        },
        {
          title: "DFS (Profundidade)",
          url: "#",
          onClick: async () => {
            if (!logicalGraph.nodes.length) {
              toast.info("Adicione nós ao grafo primeiro");
              return;
            }
            const start = logicalGraph.nodes[0].id;
            await handleRunAlgorithm("dfs", { start });
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
          onClick: async () => {
            if (logicalGraph.nodes.length < 2) {
              toast.info("Adicione pelo menos dois nós ao grafo");
              return;
            }
            const start = logicalGraph.nodes[0].id;
            const end = logicalGraph.nodes[logicalGraph.nodes.length - 1].id;
            await handleRunAlgorithm("dijkstra", { start, end });
          },
        },
        {
          title: "Calcular Caminho",
          url: "#",
          onClick: async () => {
            if (logicalGraph.nodes.length < 2) {
              toast.info("Adicione pelo menos dois nós ao grafo");
              return;
            }
            const start = logicalGraph.nodes[0].id;
            const end = logicalGraph.nodes[logicalGraph.nodes.length - 1].id;
            await handleRunAlgorithm("dijkstra", { start, end });
          },
        },
      ],
    },
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
              Tem certeza que deseja limpar todo o grafo? Esta ação não pode ser
              desfeita.
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
      <RandomGraphDialog
        open={showRandomGraphDialog}
        onOpenChange={setShowRandomGraphDialog}
        onGenerate={handleGenerateRandomGraph}
      />
    </>
  );
}
