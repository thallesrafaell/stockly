export default function SideBar() {
  return (
    <div className="p w-64 bg-white">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold">STOCKLY</h1>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <button>Dashboard</button>
        <button>Produtos</button>
        <button>Vendas</button>
      </div>
    </div>
  );
}
