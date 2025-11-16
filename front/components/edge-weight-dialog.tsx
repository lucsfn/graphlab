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
    edgeWeightSchema,
    type EdgeWeightFormData,
} from "@/lib/validations/graph";

interface EdgeWeightDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSetWeight: (weight: number) => void;
    defaultWeight?: number;
}

export function EdgeWeightDialog({
    open,
    onOpenChange,
    onSetWeight,
    defaultWeight,
}: EdgeWeightDialogProps) {
    const initialWeight = Number.isFinite(defaultWeight ?? Number.NaN)
        ? (defaultWeight as number)
        : Number.NaN;

    const form = useForm<EdgeWeightFormData>({
        resolver: zodResolver(edgeWeightSchema),
        defaultValues: {
            weight: initialWeight,
        },
    });

    useEffect(() => {
        const nextWeight = Number.isFinite(defaultWeight ?? Number.NaN)
            ? (defaultWeight as number)
            : Number.NaN;

        if (open) {
            form.reset({ weight: nextWeight });
        } else {
            form.reset({ weight: Number.NaN });
        }
    }, [open, defaultWeight, form]);

    const onSubmit = (data: EdgeWeightFormData) => {
        onSetWeight(data.weight);
        form.reset({ weight: Number.NaN });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Definir Peso da Aresta</DialogTitle>
                    <DialogDescription>
                        Informe um peso numérico para a aresta.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                            value={
                                                Number.isFinite(field.value)
                                                    ? field.value
                                                    : ""
                                            }
                                            onChange={(event) => {
                                                const value =
                                                    event.target.value;
                                                field.onChange(
                                                    value === ""
                                                        ? Number.NaN
                                                        : Number(value)
                                                );
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
