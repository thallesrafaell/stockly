"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Product } from "@/app/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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

 }

export const productsTableColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Valor Unitário",
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
      return (<Badge variant={statusLabel !== "Fora de Estoque" ? "default" : "outline"} className="capitalize gap-1.5" >
        {statusLabel === "Em Estoque" ? <CircleCheckIcon className=" h-4 w-4" /> : <CircleAlertIcon className=" h-4 w-4" />}
        {statusLabel}
      </Badge>)

    }
  }
];
