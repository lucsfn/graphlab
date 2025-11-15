"use client";

import { Canvas } from "@/components/canvas";

export function GraphEditor() {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <Canvas />
        </div>
    );
}
