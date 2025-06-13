import { getTotalStock } from "@/app/_data-access/dashboard/getTotalStock";
import { Package2 } from "lucide-react";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summaryCard";

export const TotalStock = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const totalStock = await getTotalStock();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <Package2 size={24} className="text-primary" />
      </SummaryCardIcon>
      <SummaryCardTitle>Total em Estoque</SummaryCardTitle>
      <SummaryCardValue>{totalStock}</SummaryCardValue>
    </SummaryCard>
  );
};
