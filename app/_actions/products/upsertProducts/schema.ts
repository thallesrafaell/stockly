import { z } from "zod";

 
export const upsertProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  price: z.number().min(0.01, "Preço deve ser maior ou igual a zero"),
  stock: z.coerce.number().int().positive("Estoque deve ser maior que zero").min(1, "Estoque deve ser maior que zero"),
})


export type UpsertProductFormData = z.infer<typeof upsertProductSchema>;
