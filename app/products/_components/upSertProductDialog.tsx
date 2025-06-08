"use client";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Loader2 } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { useForm } from "react-hook-form";
import { CreateProductFormData, createProductSchema } from "@/app/_actions/products/createProducts/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/app/_actions/products/createProducts/createProducts";
import { toast } from "sonner";

interface UpsertProductDialogProps {
  onSuccess?: () => void;
}

const UpsertProductDialog = ({ onSuccess }: UpsertProductDialogProps) => {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 1,
    },
  });

  const onSubmit = async (data: CreateProductFormData) => {
    console.log("Form submitted with data:", data);

    try {
      await createProduct(data);
      toast.success("Produto criado com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Erro ao criar produto, tente novamente.");
    }
  };
  return ( 

    <DialogContent>
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Criar Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao sistema.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do Produto"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  prefix="R$ "
                  allowNegative={false}
                  customInput={Input}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    field.onChange(floatValue || 0);
                  }}
                  {...field}
                  onChange={() => {}}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantidade em Estoque"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="mt-4 cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Adicionar Produto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
   );
}
 
export default UpsertProductDialog;