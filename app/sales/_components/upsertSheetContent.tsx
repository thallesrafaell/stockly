"use client";
import { createSaleAction } from "@/app/_actions/sale/createSale";
import { Combobox, ComboboxOption } from "@/app/_components/ui/comobobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { formatCurrency } from "@/app/_helpers/currency";
import { Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheckIcon, PlusIcon } from "lucide-react";
import { flattenValidationErrors } from "next-safe-action";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import UpsertTableSaleDropdownMenu from "./upsertTableSaleDropdownMenu";

const formSchema = z.object({
  productId: z.string().uuid().min(1, "Selecione um produto"),
  quantity: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Quantidade deve ser maior que zero"),
});

type FormSchema = z.infer<typeof formSchema>;

interface UpsertSheetContentProps {
  products: Product[];
  productsOption: ComboboxOption[];
  onSubmitSuccess: () => void;
}

interface SelectedProducts {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const UpsertSheetContent = ({
  productsOption,
  products,
  onSubmitSuccess,
}: UpsertSheetContentProps) => {
  const { execute: executeCreateSale } = useAction(createSaleAction, {
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedError = flattenValidationErrors(validationErrors);
      toast.error(serverError ?? flattenedError.formErrors[0]);
    },
  });
  const [selectedProduct, setSelectedProduct] = useState<SelectedProducts[]>(
    [],
  );
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });
  const onSubmit = (data: FormSchema) => {
    const selectedProductData = products.find(
      (product) => product.id === data.productId,
    );

    if (!selectedProductData) {
      toast.error("Produto não encontrado");
      return;
    }

    // Verifica o estoque antes de qualquer adição
    if (data.quantity > selectedProductData.stock) {
      toast.error("Quantidade excede o estoque disponível");
      form.setError("quantity", {
        message: "Quantidade excede o estoque disponível",
      });
      return;
    }

    setSelectedProduct((prev) => {
      const existingProduct = prev.find(
        (product) => product.id === data.productId,
      );

      // Verifica o estoque total considerando quantidade existente
      if (existingProduct) {
        const totalQuantity = existingProduct.quantity + data.quantity;
        if (totalQuantity > selectedProductData.stock) {
          toast.error("Quantidade excede o estoque disponível");
          form.setError("quantity", {
            message: "Quantidade excede o estoque disponível",
          });
          return prev;
        }

        return prev.map((product) =>
          product.id === data.productId
            ? { ...product, quantity: totalQuantity }
            : product,
        );
      }

      return [
        ...prev,
        {
          id: selectedProductData.id,
          name: selectedProductData.name,
          price:
            typeof selectedProductData.price === "number"
              ? selectedProductData.price
              : Number(selectedProductData.price),
          quantity: data.quantity,
        },
      ];
    });
    toast.success("Produto adicionado com sucesso");
    form.reset();
  };

  const onDeleteProduct = (id: string) => {
    setSelectedProduct((prev) => prev.filter((product) => product.id !== id));
    toast.success("Produto removido com sucesso");
  };
  const onEditProduct = (id: string) => {
    const productToEdit = selectedProduct.find((product) => product.id === id);
    if (!productToEdit) {
      toast.error("Produto não encontrado");
      return;
    }
    form.setValue("productId", productToEdit.id);
    form.setValue("quantity", productToEdit.quantity);
    setSelectedProduct((prev) => prev.filter((product) => product.id !== id));
    toast.success("Produto selecionado para edição");
  };

  const onSubmitSale = async () => {
    await executeCreateSale({
      products: selectedProduct.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    });
    toast.success("Venda finalizada com sucesso!");
    onSubmitSuccess();
    setSelectedProduct([]);
  };

  const totalPriceProducts = useMemo(() => {
    return selectedProduct.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  }, [selectedProduct]);

  return (
    <SheetContent className="!max-w-[600px] p-6">
      <SheetHeader>
        <SheetTitle>Nova venda</SheetTitle>
        <SheetDescription>
          Insira os dados da venda para continuar.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Combobox
                    options={productsOption}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um produto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Quantidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full cursor-pointer gap-2"
            variant={"secondary"}
            type="submit"
          >
            <PlusIcon />
            Adicionar produto
          </Button>
        </form>
      </Form>
      <Table>
        <TableCaption>Produtos selecionados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProduct.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                {formatCurrency(product.price * product.quantity)}
              </TableCell>
              <TableCell>
                <UpsertTableSaleDropdownMenu
                  product={{ id: product.id }}
                  onDelete={onDeleteProduct}
                  onEdit={onEditProduct}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>{formatCurrency(totalPriceProducts)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter>
        <Button
          className="mt-4 w-full cursor-pointer gap-2"
          disabled={selectedProduct.length === 0 || form.formState.isSubmitting}
          type="submit"
          onClick={onSubmitSale}
        >
          <CheckCheckIcon size={20} />
          Finalizar Venda
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default UpsertSheetContent;
