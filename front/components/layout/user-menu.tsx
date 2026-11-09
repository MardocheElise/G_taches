"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/components/providers/auth-provider";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = user ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}` : "U";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <DropdownMenu>
      {" "}
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-3 rounded-lg p-1 text-left outline-none hover:bg-muted">
            {" "}
          </button>
        }
      >
        <Avatar className="h-9 w-9">
          {" "}
          <AvatarFallback>{initials.toUpperCase()} </AvatarFallback>{" "}
        </Avatar>
        <div className="hidden text-sm md:block">
          <p className="max-w-40 truncate font-medium">
            {user?.prenom} {user?.nom}
          </p>

          <p className="max-w-40 truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserCircle className="mr-2 h-4 w-4" />
          Mon profil
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
