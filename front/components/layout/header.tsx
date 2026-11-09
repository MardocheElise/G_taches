"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
return ( 
<header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6"> 
<div className="flex items-center gap-2"> 
  <MobileSidebar />
  <h2 className="text-sm font-medium text-muted-foreground">
      Gestion de projets
  </h2>
</div>

<div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
    </Button>

    <UserMenu />
</div>
</header>

);
}
