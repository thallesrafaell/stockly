import {
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderSubtitle,
  HeaderTitle,
} from "./_components/header";
import { Button } from "./_components/ui/button";

export default function Home() {
  return (
    <div className="mx-8 my-8 w-full space-y-8 rounded-lg bg-white p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Dashboard</HeaderSubtitle>
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <Button variant="outline" className="h-8 px-4">
            Criar Novo
          </Button>
        </HeaderRight>
      </Header>
    </div>
  );
}
