"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
LayoutDashboard,
FolderKanban,
Users,
Sparkles,
UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const baseMenuItems = [
{
label: "Dashboard",
href: "/dashboard",
icon: LayoutDashboard,
},
{
label: "Projets",
href: "/projects",
icon: FolderKanban,
},
// {
// label: "Mes compétences",
// href: "/competences",
// // href: "/profile",
// icon: Sparkles,
// },
{
  label: "Mon profil",
  href: "/profile",
  icon: UserRound,
}
];

const adminMenuItems = [
{
label: "Dashboard",
href: "/dashboard",
icon: LayoutDashboard,
},

{
label: "Utilisateurs",
href: "/users",
icon: Users,
},

{
label: "Projets",
href: "/projects",
icon: FolderKanban,
},

{
  label: "Mon profil",
  href: "/profile",
  icon: UserRound,
}
];

export function Sidebar() {
const pathname = usePathname();
const { user } = useAuth();

const menuItems =
user?.role === "SUPER_ADMIN"
? [...adminMenuItems]
: baseMenuItems;

return (
<aside className="hidden h-screen w-64 shrink-0 border-r bg-background md:flex md:flex-col">
 <div className="flex h-16 items-center border-b px-6"> 
  <Link
       href="/dashboard"
       className="text-lg font-bold">
        Project ODC 
  </Link> 
  </div>

  <nav className="flex-1 space-y-1 p-3">
    {menuItems.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.href === "/dashboard"
          ? pathname === item.href
          : pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />

          {item.label}
        </Link>
      );
    })}
  </nav>

  <div className="border-t p-4">
    <p className="truncate text-sm font-medium">
      {user?.prenom} {user?.nom}
    </p>

    <p className="text-xs text-muted-foreground">
      {user?.role === "SUPER_ADMIN"
        ? "Super Administrateur"
        : "Utilisateur"}
    </p>
  </div>
</aside>

);
}
