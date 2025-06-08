"use client";

import { AlertDialogTrigger } from "@/app/_components/ui/alert-dialog";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Product } from "@/app/generated/prisma";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import ComponentDeleteDialog from "./componentDeleteDiolog";
import UpsertProductDialog from "./upSertProductDialog";
import { useState } from "react";
import { NumericFormat } from "react-number-format";


const getStatusLabel = (status: string) => {
  switch (status) {
    case "IN_STOCK":
      return "Em Estoque";
    case "OUT_OF_STOCK":
      return "Fora de Estoque";
    case "DISCONTINUED":
      return "Descontinuado";
    default:
      return "Desconhecido";
  }
};

export const productsTableColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Valor Unitário",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <NumericFormat
          value={Number(product.price)}
          displayType="text"
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          fixedDecimalScale
          decimalScale={2}
        />
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Quantidade",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const statusLabel = getStatusLabel(product.status);
      return (
        <Badge
          variant={statusLabel !== "Fora de Estoque" ? "default" : "outline"}
          className="gap-1.5 capitalize"
        >
          {statusLabel === "Em Estoque" ? (
            <CircleCheckIcon className="h-4 w-4" />
          ) : (
            <CircleAlertIcon className="h-4 w-4" />
          )}
          {statusLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",

    cell: ({ row }) => {
      const [editingDialogOpen, setEditingDialogOpen] = useState(false);
      const product = row.original;
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
    },
  },
];
