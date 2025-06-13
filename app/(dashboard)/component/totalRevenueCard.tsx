import { getTotalRevenue } from "@/app/_data-access/dashboard/getTotalRevenue";
import { formatCurrency } from "@/app/_helpers/currency";
import { DollarSignIcon } from "lucide-react";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summaryCard";

const TotalRevenueCard = async () => {
  const totalRevenue = await getTotalRevenue();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <DollarSignIcon size={24} className="text-primary" />
      </SummaryCardIcon>
      <SummaryCardTitle>Receita total</SummaryCardTitle>
      <SummaryCardValue>{formatCurrency(totalRevenue)}</SummaryCardValue>
    </SummaryCard>
  );
};

export default TotalRevenueCard;
