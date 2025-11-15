"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { addNodeSchema, type AddNodeFormData } from "@/lib/validations/graph";

interface AddNodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddNode: (label: string) => void;
}

export function AddNodeDialog({
    open,
    onOpenChange,
    onAddNode,
}: AddNodeDialogProps) {
    const form = useForm<AddNodeFormData>({
        resolver: zodResolver(addNodeSchema),
        defaultValues: {
            label: "",
        },
    });

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const onSubmit = (data: AddNodeFormData) => {
        onAddNode(data.label);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Nó</DialogTitle>
                    <DialogDescription>
                        Digite um rótulo para o novo nó do grafo.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rótulo do Nó</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: A, Node1, Vértice"
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
