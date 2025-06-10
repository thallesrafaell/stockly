"use client";
import { upsertSaleAction } from "@/app/_actions/sale/upsertSale/upsertSale";
import { Button } from "@/app/_components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheckIcon, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo, useState } from "react";
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

interface SelectedProducts {
  id: string; // productId
  name: string;
  price: number;
  quantity: number;
}

// Define a constante para um array vazio de produtos selecionados
const EMPTY_SELECTED_PRODUCTS: SelectedProducts[] = [];

export interface UpsertSheetContentProps {
  products: Product[];
  productsOption: ComboboxOption[];
  onSubmitSuccess: () => void;
  isEditing?: boolean;
  saleIdToEdit?: string;
  defaultSelectedProducts?: SelectedProducts[];
}

const UpsertSheetContent = ({
  productsOption,
  products,
  onSubmitSuccess,
  isEditing = false,
  saleIdToEdit,
  defaultSelectedProducts = EMPTY_SELECTED_PRODUCTS, // Usar a constante como valor padrão
}: UpsertSheetContentProps) => {
  const { execute: executeUpsertSale, status: upsertStatus } = useAction(
    upsertSaleAction,
    {
      onError: ({ error }) => {
        // O safe-action já trata ZodErrors e outros erros.
        // O `error` aqui pode ser `validationErrors`, `serverError`, `fetchError`, etc.
        let errorMessage = "Erro ao processar venda.";
        if (typeof error === "object" && error !== null) {
          if ("validationErrors" in error && error.validationErrors) {
            // Se houver erros de validação Zod específicos do campo, você pode querer formatá-los
            // Aqui, apenas pegamos a primeira mensagem de erro geral ou do formulário, se houver.
            const validationError = error.validationErrors as Record<
              string,
              unknown
            >; // Corrigido para Record<string, unknown>
            errorMessage =
              (validationError._errors as string[])?.[0] ||
              (validationError.formErrors as string[])?.[0] ||
              "Erro de validação.";
          } else if ("serverError" in error && error.serverError) {
            errorMessage = error.serverError as string;
          } else if ("message" in error) {
            errorMessage = (error as { message: string }).message;
          }
        }
        toast.error(errorMessage);
      },
      onSuccess: (result) => {
        if (
          result &&
          typeof result === "object" &&
          "error" in result &&
          result.error
        ) {
          toast.error(result.error as string);
          return;
        }
        toast.success(
          isEditing
            ? "Venda atualizada com sucesso!"
            : "Venda criada com sucesso!",
        );
        onSubmitSuccess();
        setSelectedProduct([]);
        form.reset({ productId: "", quantity: 1 });
      },
    },
  );

  const [selectedProduct, setSelectedProduct] = useState<SelectedProducts[]>(
    defaultSelectedProducts,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });
  const { reset: resetForm } = form; // Desestruturar reset para usar na dependência do useEffect

  useEffect(() => {
    if (
      isEditing &&
      defaultSelectedProducts &&
      defaultSelectedProducts.length > 0 &&
      defaultSelectedProducts !== EMPTY_SELECTED_PRODUCTS
    ) {
      setSelectedProduct(defaultSelectedProducts);
    } else if (!isEditing) {
      setSelectedProduct(EMPTY_SELECTED_PRODUCTS); // Usar a constante estável
    }
    // Se isEditing for true, mas defaultSelectedProducts for vazio ou EMPTY_SELECTED_PRODUCTS,
    // selectedProduct não é alterado por este useEffect, preservando o estado atual (comportamento original).

    // Lógica de reset do formulário:
    // Se estiver criando, sempre reseta.
    // Se estiver editando, reseta apenas se defaultSelectedProducts tiver itens (e não for a constante vazia).
    if (
      !isEditing ||
      (isEditing &&
        defaultSelectedProducts &&
        defaultSelectedProducts.length > 0 &&
        defaultSelectedProducts !== EMPTY_SELECTED_PRODUCTS)
    ) {
      resetForm({ productId: "", quantity: 1 });
    }
  }, [isEditing, defaultSelectedProducts, resetForm]); // Depender de resetForm e da constante defaultSelectedProducts

  const onSubmit = (data: FormSchema) => {
    const productDetails = products.find((p) => p.id === data.productId);
    if (!productDetails) {
      toast.error("Produto não encontrado nos dados disponíveis.");
      return;
    }

    const currentProductInList = selectedProduct.find(
      (p) => p.id === data.productId,
    );
    const quantityAlreadyInList = currentProductInList
      ? currentProductInList.quantity
      : 0;

    if (!currentProductInList && data.quantity > productDetails.stock) {
      toast.error(
        `Quantidade (${data.quantity}) excede o estoque disponível (${productDetails.stock})`,
      );
      form.setError("quantity", {
        message: `Estoque: ${productDetails.stock}`,
      });
      return;
    }
    if (
      currentProductInList &&
      data.quantity > productDetails.stock - quantityAlreadyInList
    ) {
      toast.error(
        `Adicionar ${data.quantity} excede o estoque disponível (${productDetails.stock - quantityAlreadyInList} restante)`,
      );
      form.setError("quantity", {
        message: `Estoque restante: ${productDetails.stock - quantityAlreadyInList}`,
      });
      return;
    }

    setSelectedProduct((prevList) => {
      const existingProductIndex = prevList.findIndex(
        (p) => p.id === data.productId,
      );
      if (existingProductIndex !== -1) {
        const updatedList = [...prevList];
        const newQuantity =
          updatedList[existingProductIndex].quantity + data.quantity;
        if (newQuantity > productDetails.stock) {
          toast.error(
            `Quantidade total (${newQuantity}) para ${productDetails.name} excede o estoque (${productDetails.stock}).`,
          );
          return prevList;
        }
        updatedList[existingProductIndex] = {
          ...updatedList[existingProductIndex],
          quantity: newQuantity,
        };
        return updatedList;
      } else {
        return [
          ...prevList,
          {
            id: productDetails.id,
            name: productDetails.name,
            price: Number(productDetails.price),
            quantity: data.quantity,
          },
        ];
      }
    });
    toast.success("Produto adicionado/atualizado na lista.");
    form.reset({ productId: "", quantity: 1 });
  };

  const onDeleteProduct = (productId: string) => {
    setSelectedProduct((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Produto removido da lista.");
  };

  const onEditProduct = (productId: string) => {
    const productToEdit = selectedProduct.find((p) => p.id === productId);
    if (!productToEdit) return;
    form.setValue("productId", productToEdit.id);
    form.setValue("quantity", productToEdit.quantity);
    setSelectedProduct((prev) => prev.filter((p) => p.id !== productId));
    toast.info("Editando produto. Ajuste e adicione novamente.");
  };

  const onSubmitSale = async () => {
    if (selectedProduct.length === 0) {
      toast.error("Adicione pelo menos um produto à venda.");
      return;
    }
    const salePayload = {
      ...(isEditing && saleIdToEdit && { id: saleIdToEdit }),
      products: selectedProduct.map((p) => ({
        id: p.id,
        quantity: p.quantity,
        unitPrice: p.price,
      })),
    };
    await executeUpsertSale(salePayload);
  };

  const totalPriceProducts = useMemo(() => {
    return selectedProduct.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }, [selectedProduct]);

  return (
    <SheetContent className="!max-w-[600px] p-6">
      <SheetHeader>
        <SheetTitle>{isEditing ? "Editar Venda" : "Nova Venda"}</SheetTitle>
        <SheetDescription>
          {isEditing
            ? "Modifique os produtos e quantidades da venda."
            : "Insira os dados da venda para continuar."}
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
            {selectedProduct.find((p) => p.id === form.getValues("productId"))
              ? "Atualizar Produto na Lista"
              : "Adicionar Produto à Lista"}
          </Button>
        </form>
      </Form>
      <Table>
        <TableCaption>
          {selectedProduct.length > 0
            ? "Produtos selecionados"
            : "Nenhum produto selecionado"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Qtd.</TableHead>
            <TableHead className="text-right">Preço Unit.</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProduct.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price * product.quantity)}
              </TableCell>
              <TableCell className="text-center">
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
            <TableCell colSpan={3} className="text-right font-bold">
              Total
            </TableCell>
            <TableCell className="text-right font-bold">
              {formatCurrency(totalPriceProducts)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter>
        <Button
          className="mt-4 w-full cursor-pointer gap-2"
          disabled={
            selectedProduct.length === 0 || upsertStatus === "executing"
          }
          type="button"
          onClick={onSubmitSale}
        >
          <CheckCheckIcon size={20} />
          {isEditing ? "Atualizar Venda" : "Finalizar Venda"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default UpsertSheetContent;
