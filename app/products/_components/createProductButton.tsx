"use client";

import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertProductDialog from "./upSertProductDialog";

const AddProductButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon size={20} />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <UpsertProductDialog onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddProductButton;
