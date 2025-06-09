"use client";

import { Button } from "@/app/_components/ui/button";
import { ComboboxOption } from "@/app/_components/ui/comobobox";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { Product } from "@/app/generated/prisma";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import UpsertSheetContent from "./upsertSheetContent";

interface CreateSaleSchemaProps {
  products: Product[]; // Replace with actual type if available
  productsOption: ComboboxOption[];
} // Replace with actual type if available

const CreateSaleButton = (data: CreateSaleSchemaProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer">
          <ShoppingCart size={20} className="mr-2" />
          Nova Venda
        </Button>
      </SheetTrigger>
      <UpsertSheetContent
        {...data}
        onSubmitSuccess={() => setSheetOpen(false)}
      />
    </Sheet>
  );
};

export default CreateSaleButton;
