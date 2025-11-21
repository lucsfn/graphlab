import { z } from "zod";

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
  weight: z
    .number({
      error: "Informe um peso para a aresta",
    })
    .refine((value) => Number.isFinite(value), {
      message: "Informe um número válido",
    }),
});

export type EdgeWeightFormData = z.infer<typeof edgeWeightSchema>;

export const randomGraphSchema = z
  .object({
    nodeCount: z
      .number({
        required_error: "Informe a quantidade de nós",
        invalid_type_error: "Informe um número válido",
      })
      .int("Informe um número inteiro")
      .min(2, "Mínimo de 2 nós")
      .max(20, "Máximo de 20 nós"),
    edgeCount: z
      .number({
        required_error: "Informe a quantidade de arestas",
        invalid_type_error: "Informe um número válido",
      })
      .int("Informe um número inteiro")
      .min(1, "Mínimo de 1 aresta"),
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
