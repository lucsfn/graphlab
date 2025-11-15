"use client";

import React from "react";
import { Plus, Trash2, Pointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export function Toolbar() {
    return (
        <TooltipProvider>
            <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-2 shadow-md">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Pointer className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Selecionar</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Add Node */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
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
                                className="h-8 w-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Deletar</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
