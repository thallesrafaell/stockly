import { getTotalSales } from "@/app/_data-access/dashboard/getTotalSales";
import { CircleDollarSignIcon } from "lucide-react";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summaryCard";

const TotalSales = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const totalSales = await getTotalSales();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <CircleDollarSignIcon size={24} className="text-primary" />
      </SummaryCardIcon>
      <SummaryCardTitle>Vendas Totais</SummaryCardTitle>
      <SummaryCardValue>{totalSales}</SummaryCardValue>
    </SummaryCard>
  );
};

export default TotalSales;
