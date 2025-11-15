"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { GraphEditor } from "@/components/graph-editor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import { GraphProvider } from "@/components/graph-provider";

export default function Home() {
    return (
        <SidebarProvider>
            <ReactFlowProvider>
                <GraphProvider>
                    <AppSidebar />
                    <main className="w-full">
                        <GraphEditor />
                    </main>
                </GraphProvider>
            </ReactFlowProvider>
        </SidebarProvider>
    );
}
