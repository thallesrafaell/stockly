import z from "zod";

export const deleteSaleSchema = z.object({
  id: z.string().uuid().min(1, "ID da venda é obrigatório"),
});

export type DeleteSaleFormData = z.infer<typeof deleteSaleSchema>;
