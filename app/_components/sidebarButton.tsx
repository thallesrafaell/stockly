"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

interface SidebarButtonProps {
  children: React.ReactNode;
  href: string;
}

export default function SidebarButton({ href, children }: SidebarButtonProps) {
  const pathNname = usePathname();
  return (
    <Button
      variant={pathNname === href ? "secondary" : "ghost"}
      className="cursor-pointer justify-start gap-4"
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
