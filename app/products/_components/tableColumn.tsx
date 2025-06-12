"use client";

import ProductsStatusBadge from "@/app/_components/productsStatusBadge";
import { ProductDto } from "@/app/_data-access/products/getProducts";
import { ColumnDef } from "@tanstack/react-table";
import { NumericFormat } from "react-number-format";
import ProductsDropDownMenu from "./productsDropDownMenu";

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
      return <ProductsStatusBadge status={product.status} />;
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
