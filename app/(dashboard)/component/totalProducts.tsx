import { getTotalProducts } from "@/app/_data-access/dashboard/getTotalProducts";
import { ShoppingBasketIcon } from "lucide-react";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summaryCard";

const TotalProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const totalProducts = await getTotalProducts();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <ShoppingBasketIcon size={24} className="text-primary" />
      </SummaryCardIcon>
      <SummaryCardTitle>Total em Produtos</SummaryCardTitle>
      <SummaryCardValue>{totalProducts}</SummaryCardValue>
    </SummaryCard>
  );
};

export default TotalProducts;
