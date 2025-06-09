"use client";
import {
  UpsertProductFormData,
  upsertProductSchema,
} from "@/app/_actions/products/upsertProducts/schema";
import { upsertProduct } from "@/app/_actions/products/upsertProducts/upsertProducts";
import { Button } from "@/app/_components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { flattenValidationErrors } from "next-safe-action";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface UpsertProductDialogProps {
  defaultValues?: UpsertProductFormData;
  onSuccess?: () => void;
}

const UpsertProductDialog = ({
  onSuccess,
  defaultValues,
}: UpsertProductDialogProps) => {
  const { execute: executeUpsertProduct } = useAction(upsertProduct, {
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedErrors = flattenValidationErrors(validationErrors);
      toast.error(serverError ?? flattenedErrors.formErrors[0]);
    },
  });

  const form = useForm<UpsertProductFormData>({
    resolver: zodResolver(upsertProductSchema),
    defaultValues: defaultValues ?? {
      name: "",
      price: 0,
      stock: 1,
    },
  });

  const onSubmit = async (data: UpsertProductFormData) => {
    await executeUpsertProduct(data);
    toast.success("Produto criado com sucesso!");
    onSuccess?.();
  };

  const isEditing = !!defaultValues;
  return (
    <DialogContent>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Produto" : "Criar Produto"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite as informações do produto."
                : "Adicione um novo produto ao sistema."}
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
              {isEditing ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertProductDialog;
