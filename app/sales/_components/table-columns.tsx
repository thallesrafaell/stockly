"use client";
import { ComboboxOption } from "@/app/_components/ui/comobobox";
import { ProductDto } from "@/app/_data-access/products/getProducts";
import { salesDto } from "@/app/_data-access/sale/getSales";
import { formatCurrency } from "@/app/_helpers/currency";
import { ColumnDef } from "@tanstack/react-table";
import SalesTableDropdownMenu from "./saleTableDropDownMenu";

export const saleTableColumns = (
  products: ProductDto[],
  productOptions: ComboboxOption[],
): ColumnDef<salesDto>[] => [
  {
    accessorKey: "productsName",
    header: "Produtos",
  },
  {
    accessorKey: "totalProducts",
    header: "Quantidade",
  },
  {
    header: "Preço Total",
    cell: ({
      row: {
        original: { totalAmount },
      },
    }) => {
      return formatCurrency(totalAmount);
    },
  },
  {
    header: "Data",
    cell: ({
      row: {
        original: { date },
      },
    }) => {
      return new Date(date).toLocaleDateString();
    },
  },
  {
    header: "Ações",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <SalesTableDropdownMenu
          sale={sale}
          products={products}
          productOptions={productOptions}
        />
      );
    },
  },
];
