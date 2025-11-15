"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditNodeDialogProps {
    open: boolean;
    initialLabel: string;
    onOpenChange: (open: boolean) => void;
    onSubmit: (label: string) => void;
}

export function EditNodeDialog({
    open,
    initialLabel,
    onOpenChange,
    onSubmit,
}: EditNodeDialogProps) {
    const [label, setLabel] = useState<string>(initialLabel);

    useEffect(() => {
        setLabel(initialLabel);
    }, [initialLabel]);

    const handleDialogOpenChange = (value: boolean) => {
        onOpenChange(value);
        if (!value) {
            setLabel(initialLabel);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = label.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar rótulo do nó</DialogTitle>
                    <DialogDescription>
                        Atualize o rótulo exibido para este nó.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-node-label">Rótulo</Label>
                        <Input
                            id="edit-node-label"
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
