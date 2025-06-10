import { z } from "zod";

export const upsertSaleSchema = z.object({
  id: z.string().uuid().optional(), // ID é opcional, usado para update
  products: z.array(
    z.object({
      id: z.string().uuid().min(1, "ID do produto é obrigatório"),
      quantity: z.coerce
        .number()
        .int()
        .positive()
        .min(1, "Quantidade deve ser maior que zero"),
      unitPrice: z.coerce.number().positive("Preço unitário deve ser positivo"), // Adicionado para consistência
    }),
  ),
});

export type UpsertSaleSchema = z.infer<typeof upsertSaleSchema>;
