import { z } from "zod";

export const deleteProductSchema = z.object({
  id: z.string().uuid().trim().min(1, "ID do produto é obrigatório"),
});

export type DeleteProductFormData = z.infer<typeof deleteProductSchema>;
