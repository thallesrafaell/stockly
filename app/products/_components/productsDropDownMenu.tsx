import { AlertDialog, AlertDialogTrigger } from "@/app/_components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/app/_components/ui/dropdown-menu";
import { MoreHorizontalIcon, ClipboardCopyIcon, EditIcon, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import ComponentDeleteDialog from "./componentDeleteDiolog";
import UpsertProductDialog from "./upSertProductDialog";
import { Product } from "@/app/generated/prisma";
// Make sure to import all used components and icons here
// import { AlertDialog, Dialog, DropdownMenu, DropdownMenuTrigger, Button, MoreHorizontalIcon, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, ClipboardCopyIcon, DialogTrigger, EditIcon, AlertDialogTrigger, TrashIcon, UpsertProductDialog, ComponentDeleteDialog } from "your-component-library";

type ProductsDropDownMenuProps = {
  product: Product;
};

const ProductsDropDownMenu: React.FC<ProductsDropDownMenuProps> = ({ product }) => {
  const [editingDialogOpen, setEditingDialogOpen] = useState(false);

  return (
    <AlertDialog>
      <Dialog open={editingDialogOpen} onOpenChange={setEditingDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer p-1 hover:bg-transparent"
            >
              <MoreHorizontalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-1.5">
              <ClipboardCopyIcon size={16} /> Copiar ID
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer gap-1.5">
                <EditIcon size={16} />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>

            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer gap-1.5 text-red-500">
                <TrashIcon color="red" size={16} />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpsertProductDialog
          defaultValues={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: product.stock,
          }}
          onSuccess={() => setEditingDialogOpen(false)}
        />
        <ComponentDeleteDialog id={product.id} />
      </Dialog>
    </AlertDialog>
  );
};

export default ProductsDropDownMenu;