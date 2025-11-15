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
import { edgeWeightSchema, type EdgeWeightFormData } from "@/lib/validations/graph";

interface EdgeWeightDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSetWeight: (weight: number | undefined) => void;
    defaultWeight?: number;
}

export function EdgeWeightDialog({
    open,
    onOpenChange,
    onSetWeight,
    defaultWeight,
}: EdgeWeightDialogProps) {
    const form = useForm<EdgeWeightFormData>({
        resolver: zodResolver(edgeWeightSchema),
        defaultValues: {
            weight: defaultWeight,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({ weight: defaultWeight });
        } else {
            form.reset();
        }
    }, [open, defaultWeight, form]);

    const onSubmit = (data: EdgeWeightFormData) => {
        // Permite salvar undefined (campo vazio) ou um número válido
        onSetWeight(data.weight);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Definir Peso da Aresta</DialogTitle>
                    <DialogDescription>
                        Digite o peso para a aresta (opcional).
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                            autoFocus
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? undefined : value);
                                            }}
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
                            <Button type="submit">Definir</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
