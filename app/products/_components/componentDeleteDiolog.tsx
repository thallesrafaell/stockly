import { deleteProduct } from "@/app/_actions/products/deleteProducts/deleteProducts";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { flattenValidationErrors } from "next-safe-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface DeleteProductFormData {
  id: string;
}

export default function ComponentDeleteDialog({ id }: DeleteProductFormData) {
  const { execute: executeDeleteProduct } = useAction(deleteProduct, {
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedErrors = flattenValidationErrors(validationErrors);
      toast.error(serverError ?? flattenedErrors.formErrors[0]);
    },
    onSuccess() {
      toast.success("Produto excluído com sucesso!");
    },
  });

  const handleContinueClick = async () => {
    await executeDeleteProduct({ id });
    toast.success("Produto excluído com sucesso!");
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Tem certeza que deseja excluir este produto?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Você esta prestes a excluir um produto. Esta ação é irreversível.
          Deseja continuar?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleContinueClick}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
