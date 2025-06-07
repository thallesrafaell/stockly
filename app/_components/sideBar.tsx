import { LayoutGridIcon, Package2Icon, ShoppingBasketIcon } from "lucide-react";
import SidebarButton from "./sidebarButton";
export default function SideBar() {
  return (
    <div className="p w-64 bg-white">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold">STOCKLY</h1>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <SidebarButton href="/">
          <LayoutGridIcon size={20} /> Dashboard
        </SidebarButton>
        <SidebarButton href="/products">
          <Package2Icon size={20} /> Produtos
        </SidebarButton>
        <SidebarButton href="/sales">
          <ShoppingBasketIcon size={20} /> Vendas
        </SidebarButton>
      </div>
    </div>
  );
}
