"use client";

import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleLogout}
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 width:100%"
      role="menuitem"
      aria-disabled="false"
    >
      Logout
    </button>
  );
}
