import { deleteSale } from "@/app/_actions/sale/deleteSale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { ComboboxOption } from "@/app/_components/ui/comobobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Sheet } from "@/app/_components/ui/sheet";
import { ProductDto } from "@/app/_data-access/products/getProducts";
import { salesDto } from "@/app/_data-access/sale/getSales";
import {
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import UpsertSheetContent from "./upsertSheetContent";

interface SalesTableDropdownMenuProps {
  sale: salesDto; // Agora salesDto deve ter saleProducts
  productOptions: ComboboxOption[];
  products: ProductDto[];
}

const SalesTableDropdownMenu = ({
  sale,
  products,
  productOptions,
}: SalesTableDropdownMenuProps) => {
  const [upsertSheetIsOpen, setUpsertSheetIsOpen] = useState(false);
  const { execute: executeDeleteSale } = useAction(deleteSale, {
    onSuccess: () => {
      toast.success("Venda deletada com sucesso.");
    },
    onError: (error) => {
      console.error("Erro ao deletar venda:", error);
      toast.error("Erro ao deletar a venda.");
    },
  });
  const handleCopyToClipboardClick = () => {
    navigator.clipboard.writeText(sale.id);
    toast.success("ID copiado para a área de transferência.");
  };
  const handleConfirmDeleteClick = () => executeDeleteSale({ id: sale.id });

  const handleEditClick = () => {
    if (!sale.saleProducts || sale.saleProducts.length === 0) {
      toast.error(
        "Dados dos produtos da venda não encontrados ou vazios para edição.",
      );
      console.error(
        "sale.saleProducts está indefinido ou vazio. Verifique a estrutura de salesDto e getSales.",
        sale,
      );
      return;
    }
    setUpsertSheetIsOpen(true);
  };

  const defaultSelectedProductsForEdit = useMemo(() => {
    if (!sale.saleProducts) return [];
    return sale.saleProducts.map((sp) => ({
      id: sp.productId,
      name: sp.productName,
      price: Number(sp.unitPrice),
      quantity: sp.quantity,
    }));
  }, [sale.saleProducts]);

  return (
    <Sheet open={upsertSheetIsOpen} onOpenChange={setUpsertSheetIsOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-1.5"
              onClick={handleCopyToClipboardClick}
            >
              <ClipboardCopyIcon size={16} />
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-1.5" onClick={handleEditClick}>
              <EditIcon size={16} />
              Editar
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="gap-1.5 text-red-600 hover:!text-red-700">
                <TrashIcon size={16} />
                Deletar
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir esta venda. Esta ação não pode ser
              desfeita. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteClick}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {upsertSheetIsOpen && (
        <UpsertSheetContent
          productsOption={productOptions}
          products={products}
          onSubmitSuccess={() => {
            setUpsertSheetIsOpen(false);
          }}
          isEditing={true}
          saleIdToEdit={sale.id}
          defaultSelectedProducts={defaultSelectedProductsForEdit} // Usando a variável memoizada
        />
      )}
    </Sheet>
  );
};

export default SalesTableDropdownMenu;
