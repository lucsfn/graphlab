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
