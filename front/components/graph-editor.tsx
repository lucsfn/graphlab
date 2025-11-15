"use client";

import React from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

export function GraphEditor() {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            <Canvas />
            <Toolbar />
        </div>
    );
}
