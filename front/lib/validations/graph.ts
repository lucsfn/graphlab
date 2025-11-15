import { z } from "zod";

// Schema para adicionar nó
export const addNodeSchema = z.object({
    label: z
        .string()
        .min(1, "O rótulo do nó é obrigatório")
        .max(50, "O rótulo deve ter no máximo 50 caracteres")
        .trim(),
});

export type AddNodeFormData = z.infer<typeof addNodeSchema>;

// Schema para adicionar aresta
export const addEdgeSchema = z.object({
    source: z.string().min(1, "Selecione o nó de origem"),
    target: z.string().min(1, "Selecione o nó de destino"),
    weight: z
        .union([
            z.string().min(1, "O peso é obrigatório").transform((val) => {
                const parsed = parseFloat(val);
                if (isNaN(parsed) || !isFinite(parsed)) {
                    throw new z.ZodError([
                        {
                            code: "custom",
                            path: ["weight"],
                            message: "O peso deve ser um número válido",
                        },
                    ]);
                }
                return parsed;
            }),
            z.number().finite("O peso deve ser um número válido"),
        ]),
}).refine(
    (data) => data.source !== data.target,
    {
        message: "O nó de origem e destino não podem ser iguais",
        path: ["target"],
    }
);

export type AddEdgeFormData = z.infer<typeof addEdgeSchema>;

// Schema para peso de aresta (opcional - permite deletar valor)
export const edgeWeightSchema = z.object({
    weight: z
        .union([
            z.string().transform((val) => {
                if (val === "" || val === undefined || val === null) return undefined;
                const parsed = parseFloat(val);
                if (isNaN(parsed) || !isFinite(parsed)) {
                    return undefined;
                }
                return parsed;
            }),
            z.number().finite(),
            z.undefined(),
        ])
        .optional(),
});

export type EdgeWeightFormData = z.infer<typeof edgeWeightSchema>;

