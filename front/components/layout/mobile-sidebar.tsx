// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
// LayoutDashboard,
// FolderKanban,
// Menu,
// Sparkles,
// Users,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
// Sheet,
// SheetContent,
// SheetTrigger,
// } from "@/components/ui/sheet";

// import { cn } from "@/lib/utils";
// import { useAuth } from "@/components/providers/auth-provider";

// const baseMenuItems = [
// {
// label: "Dashboard",
// href: "/dashboard",
// icon: LayoutDashboard,
// },
// {
// label: "Projets",
// href: "/projects",
// icon: FolderKanban,
// },
// {
// label: "Mes compétences",
// href: "/competences",
// icon: Sparkles,
// },
// ];

// const adminMenuItems = [
// {
// label: "Utilisateurs",
// href: "/users",
// icon: Users,
// },
// ];

// export function MobileSidebar() {
// const pathname = usePathname();
// const { user } = useAuth();

// const menuItems =
// user?.role === "SUPER_ADMIN"
// ? [...baseMenuItems, ...adminMenuItems]
// : baseMenuItems;

// return ( <Sheet> <SheetTrigger asChild> <Button
//        variant="ghost"
//        size="icon"
//        className="md:hidden"
//        aria-label="Ouvrir le menu"
//      > <Menu className="h-5 w-5" /> </Button> </SheetTrigger>

//   <SheetContent
//     side="left"
//     className="w-72 p-0"
//   >
//     <div className="flex h-16 items-center border-b px-6">
//       <span className="text-lg font-bold">
//         Project Manager
//       </span>
//     </div>

//     <nav className="space-y-1 p-3">
//       {menuItems.map((item) => {
//         const Icon = item.icon;

//         const isActive =
//           item.href === "/dashboard"
//             ? pathname === item.href
//             : pathname.startsWith(item.href);

//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={cn(
//               "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
//               isActive
//                 ? "bg-primary text-primary-foreground"
//                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
//             )}
//           >
//             <Icon className="h-5 w-5" />

//             {item.label}
//           </Link>
//         );
//       })}
//     </nav>
//   </SheetContent>
// </Sheet>

// );
// }




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Menu,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  {
    label: "Mes compétences",
    href: "/competences",
    icon: Sparkles,
  },
];

const adminMenuItems = [
  {
    label: "Utilisateurs",
    href: "/users",
    icon: Users,
  },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems =
    user?.role === "SUPER_ADMIN"
      ? [...baseMenuItems, ...adminMenuItems]
      : baseMenuItems;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />

      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-bold">Project Manager</span>
        </div>

        <nav className="space-y-1 p-3">
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
      </SheetContent>
    </Sheet>
  );
}