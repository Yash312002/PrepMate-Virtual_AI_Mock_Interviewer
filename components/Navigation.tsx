"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
        <h2 className="text-primary-100">PrepMate</h2>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-10 rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {pathname === '/profile' ? (
            <DropdownMenuItem asChild>
              <Link href="/" className="w-full">Home</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <LogoutButton/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}