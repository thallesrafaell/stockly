import { deleteProduct } from "@/app/_actions/products/deleteProducts/deleteProducts";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/_components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteProductFormData {
  id: string;
}

export default function ComponentDeleteDialog({ id }: DeleteProductFormData) {
  const handleContinueClick = async () => {
    try {
      await deleteProduct({ id });
      toast.success("Produto excluído com sucesso!");
    }
    catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erro ao excluir produto, tente novamente.");
    }
   }
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
       <AlertDialogAction onClick={handleContinueClick} className="bg-red-500 hover:bg-red-600 text-white">
         Excluir
       </AlertDialogAction>
     </AlertDialogFooter>
   </AlertDialogContent>
 );
}