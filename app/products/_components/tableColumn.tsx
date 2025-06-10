"use client";

import { Badge } from "@/app/_components/ui/badge";
import { ProductDto } from "@/app/_data-access/products/getProducts";
import { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { NumericFormat } from "react-number-format";
import ProductsDropDownMenu from "./productsDropDownMenu";

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

export const productsTableColumns: ColumnDef<ProductDto>[] = [
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
      const product = row.original;
      return <ProductsDropDownMenu product={product} />;
    },
  },
];
