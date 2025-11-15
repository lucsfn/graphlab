"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { GraphEditor } from "@/components/graph-editor";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <GraphEditor />
            </main>
        </SidebarProvider>
    );
}
