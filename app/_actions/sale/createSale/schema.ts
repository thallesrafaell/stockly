import { z } from "zod";

export const createSaleSechema = z.object({
  products: z.array(
    z.object({
      id: z.string().uuid().min(1, "ID do produto é obrigatório"),
      quantity: z.coerce
        .number()
        .int()
        .positive()
        .min(1, "Quantidade deve ser maior que zero"),
    }),
  ),
});

export type CreateSaleSchema = z.infer<typeof createSaleSechema>;
