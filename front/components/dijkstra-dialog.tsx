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
import {
  dijkstraParamsSchema,
  type DijkstraParamsFormData,
} from "@/lib/validations/graph";
import type { LogicalNode } from "@/types/graph";

interface DijkstraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: LogicalNode[];
  onConfirm: (params: DijkstraParamsFormData) => void;
}

export function DijkstraDialog({
  open,
  onOpenChange,
  nodes,
  onConfirm,
}: DijkstraDialogProps) {
  const form = useForm<DijkstraParamsFormData>({
    resolver: zodResolver(dijkstraParamsSchema),
    defaultValues: {
      start: "",
      end: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ start: "", end: "" });
    }
  }, [open, form]);

  const handleSubmit = (data: DijkstraParamsFormData) => {
    onConfirm(data);
    onOpenChange(false);
  };

  const disableSelects = nodes.length < 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Executar Dijkstra</DialogTitle>
          <DialogDescription>
            Escolha os nós de início e fim para calcular o caminho mínimo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nó de início</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disableSelects}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nó inicial" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nó de destino</FormLabel>
                  <FormControl>
                    <Select
                      disabled={disableSelects}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nó final" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button type="submit" disabled={disableSelects}>
                Calcular
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
