"use client";

import * as React from "react";
import {
    Edit2,
    Play,
    Zap,
    GitBranch,
    MapPin,
} from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { NavSection } from "@/components/nav-section";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const data = {
    graphSection: [
        {
            title: "Operações",
            url: "#",
            icon: Edit2,
            isActive: true,
            items: [
                {
                    title: "Adicionar Nó",
                    url: "#",
                },
                {
                    title: "Adicionar Aresta",
                    url: "#",
                },
                {
                    title: "Editar Grafo",
                    url: "#",
                },
                {
                    title: "Limpar Grafo",
                    url: "#",
                },
            ],
        },
        {
            title: "Visualização",
            url: "#",
            icon: MapPin,
            items: [
                {
                    title: "Nós Visitados",
                    url: "#",
                },
                {
                    title: "Arestas Visitadas",
                    url: "#",
                },
                {
                    title: "Resetar Visualização",
                    url: "#",
                },
            ],
        },
    ],
    algorithmSection: [
        {
            title: "Busca",
            url: "#",
            icon: Zap,
            items: [
                {
                    title: "BFS (Largura)",
                    url: "#",
                },
                {
                    title: "DFS (Profundidade)",
                    url: "#",
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
                },
                {
                    title: "Calcular Caminho",
                    url: "#",
                },
            ],
        },
        {
            title: "Controle",
            url: "#",
            icon: Play,
            items: [
                {
                    title: "Executar",
                    url: "#",
                },
                {
                    title: "Pausar",
                    url: "#",
                },
                {
                    title: "Reiniciar",
                    url: "#",
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AppLogo collapsed={isCollapsed} />
            </SidebarHeader>
            <SidebarContent>
                <NavSection title="Grafo" items={data.graphSection} />
                <NavSection title="Algoritmos" items={data.algorithmSection} />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
