import { z } from "zod";

const finiteNumber = (message: string) =>
  z.number().refine((value) => Number.isFinite(value), { message });

const integerField = (message: string) =>
  finiteNumber(message).int("Informe um número inteiro");

export const addNodeSchema = z.object({
  label: z
    .string()
    .min(1, "O rótulo do nó é obrigatório")
    .max(50, "O rótulo deve ter no máximo 50 caracteres")
    .trim(),
});

export type AddNodeFormData = z.infer<typeof addNodeSchema>;

export const addEdgeSchema = z
  .object({
    source: z.string().min(1, "Selecione o nó de origem"),
    target: z.string().min(1, "Selecione o nó de destino"),
    weight: z.number(),
  })
  .refine((data) => data.source !== data.target, {
    message: "Origem e destino devem ser diferentes",
    path: ["target"],
  });

export type AddEdgeFormData = z.infer<typeof addEdgeSchema>;

export const edgeWeightSchema = z.object({
  weight: finiteNumber("Informe um número válido"),
});

export type EdgeWeightFormData = z.infer<typeof edgeWeightSchema>;

export const randomGraphSchema = z
  .object({
    nodeCount: integerField("Informe a quantidade de nós")
      .min(2, "Mínimo de 2 nós")
      .max(20, "Máximo de 20 nós"),
    edgeCount: integerField("Informe a quantidade de arestas").min(
      1,
      "Mínimo de 1 aresta"
    ),
  })
  .refine(
    (data) => {
      const maxEdges = (data.nodeCount * (data.nodeCount - 1)) / 2;
      return data.edgeCount <= maxEdges;
    },
    {
      message: "Número de arestas excede o máximo possível para este grafo",
      path: ["edgeCount"],
    }
  )
  .refine(
    (data) => {
      const minEdges = data.nodeCount - 1;
      return data.edgeCount >= minEdges;
    },
    {
      message: "Número de arestas insuficiente para garantir conectividade",
      path: ["edgeCount"],
    }
  );
export type RandomGraphFormData = z.infer<typeof randomGraphSchema>;

export const dijkstraParamsSchema = z
  .object({
    start: z.string().min(1, "Selecione o nó de início"),
    end: z.string().min(1, "Selecione o nó de destino"),
  })
  .refine((data) => data.start !== data.end, {
    message: "Os nós devem ser diferentes",
    path: ["end"],
  });

export type DijkstraParamsFormData = z.infer<typeof dijkstraParamsSchema>;
