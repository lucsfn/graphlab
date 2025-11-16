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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addEdgeSchema, type AddEdgeFormData } from "@/lib/validations/graph";
import { LogicalNode } from "@/types/graph";

interface AddEdgeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddEdge: (source: string, target: string, weight: number) => void;
    availableNodes: LogicalNode[];
}

export function AddEdgeDialog({
    open,
    onOpenChange,
    onAddEdge,
    availableNodes,
}: AddEdgeDialogProps) {
    const form = useForm<AddEdgeFormData>({
        resolver: zodResolver(addEdgeSchema),
        defaultValues: {
            source: "",
            target: "",
            weight: undefined,
        },
    });

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const onSubmit = (data: AddEdgeFormData) => {
        onAddEdge(data.source, data.target, data.weight);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Aresta</DialogTitle>
                    <DialogDescription>
                        Selecione os nós de origem e destino para criar uma nova
                        aresta.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {availableNodes.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                Nenhum nó disponível. Adicione pelo menos dois
                                nós para criar uma aresta.
                            </div>
                        ) : (
                            <>
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nó de Origem</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o nó de origem" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableNodes.map(
                                                        (node) => (
                                                            <SelectItem
                                                                key={node.id}
                                                                value={node.id}
                                                            >
                                                                {node.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="target"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nó de Destino</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o nó de destino" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableNodes.map(
                                                        (node) => (
                                                            <SelectItem
                                                                key={node.id}
                                                                value={node.id}
                                                            >
                                                                {node.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Ex: 5, 10.5"
                                                    value={field.value ?? ""}
                                                    onChange={(event) =>
                                                        field.onChange(
                                                            event.target
                                                                .value === ""
                                                                ? undefined
                                                                : Number(
                                                                      event
                                                                          .target
                                                                          .value
                                                                  )
                                                        )
                                                    }
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
                                    <Button
                                        type="submit"
                                        disabled={availableNodes.length < 2}
                                    >
                                        Adicionar
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
