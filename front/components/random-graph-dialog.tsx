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
  FormDescription,
} from "@/components/ui/form";
import {
  randomGraphSchema,
  type RandomGraphFormData,
} from "@/lib/validations/graph";

interface RandomGraphDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (nodeCount: number, edgeCount: number) => void;
}

export function RandomGraphDialog({
  open,
  onOpenChange,
  onGenerate,
}: RandomGraphDialogProps) {
  const form = useForm<RandomGraphFormData>({
    resolver: zodResolver(randomGraphSchema),
    defaultValues: {
      nodeCount: undefined,
      edgeCount: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nodeCount: undefined,
        edgeCount: undefined,
      });
    }
  }, [open, form]);

  const onSubmit = (data: RandomGraphFormData) => {
    onGenerate(data.nodeCount, data.edgeCount);
    form.reset();
    onOpenChange(false);
  };

  const nodeCount = form.watch("nodeCount");
  const maxEdges =
    nodeCount && nodeCount >= 2 ? (nodeCount * (nodeCount - 1)) / 2 : 0;
  const minEdges = nodeCount && nodeCount >= 2 ? nodeCount - 1 : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Grafo Aleatório</DialogTitle>
          <DialogDescription>
            Configure a quantidade de nós e arestas para gerar um grafo
            aleatório.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nodeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Nós</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 5"
                      autoFocus
                      value={
                        field.value !== undefined && !isNaN(field.value)
                          ? field.value
                          : ""
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>Entre 2 e 20 nós</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edgeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Arestas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 6"
                      value={
                        field.value !== undefined && !isNaN(field.value)
                          ? field.value
                          : ""
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Mínimo de {minEdges} e máximo de {maxEdges} arestas para{" "}
                    {nodeCount || 0} nós
                  </FormDescription>
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
              <Button type="submit">Gerar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
