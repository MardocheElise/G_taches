import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";

interface DashboardLayoutProps {
children: ReactNode;
}

export default function DashboardLayout({
children,
}: DashboardLayoutProps) {
return ( <ProtectedRoute> <div className="flex min-h-screen bg-muted/30"> <Sidebar />

    <div className="flex min-w-0 flex-1 flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <AppBreadcrumb />
        </div>

        {children}
      </main>
    </div>
  </div>
</ProtectedRoute>

);
}
