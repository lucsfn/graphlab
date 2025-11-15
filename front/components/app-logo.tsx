import { ChartScatter } from "lucide-react";

interface AppLogoProps {
    collapsed?: boolean;
}

export function AppLogo({ collapsed = false }: AppLogoProps) {
    return (
        <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
            <div className="shrink-0">
                <ChartScatter className="h-6 w-6 text-primary" />
            </div>
            {!collapsed && (
                <h1 className="whitespace-nowrap text-lg font-bold transition-opacity duration-300">
                    Graph<span className="font-semibold">Lab</span>
                </h1>
            )}
        </div>
    );
}
