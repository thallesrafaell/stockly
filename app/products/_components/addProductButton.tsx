"use client";

import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
 
const formSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  price: z.number().min(0.01, "Preço deve ser maior ou igual a zero"),
  stock: z.coerce.number().int().positive("Estoque deve ser maior que zero").min(1, "Estoque deve ser maior que zero"),
})

const AddProductButton = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 1,
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon size={20} />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>

        <DialogHeader>
          <DialogTitle>Criar Produto</DialogTitle>
          <DialogDescription>Adicione um novo produto ao sistema.</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                  <Input
                    placeholder="Nome do Produto"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                 </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                   <FormControl>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    allowNegative={false}
                    customInput={Input}
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      field.onChange(floatValue || 0);
                    }}
                    {...field}
                    onChange={() => {}}
                    />
                  </FormControl>
                    <FormMessage />

                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade em Estoque</FormLabel>
                  <FormControl>

                  <Input
                    type="number"
                    placeholder="Quantidade em Estoque"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="mt-4 cursor-pointer">
                  Cancelar
                </Button>
              </DialogClose>
            <Button
              type="submit"
              className="mt-4 cursor-pointer"
              onClick={form.handleSubmit(onSubmit)}
            >
              Adicionar Produto
              </Button>
           </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductButton;