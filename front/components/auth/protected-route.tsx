"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

interface ProtectedRouteProps {
children: ReactNode;
}

export function ProtectedRoute({
children,
}: ProtectedRouteProps) {
const router = useRouter();

const {
loading,
isAuthenticated,
} = useAuth();

useEffect(() => {
if (!loading && !isAuthenticated) {
router.replace("/login");
}
}, [
loading,
isAuthenticated,
router,
]);

if (loading) {
return (
<div className="flex min-h-screen items-center justify-center">
Chargement...
</div>
);
}

if (!isAuthenticated) {
return null;
}

return <>{children}</>;
}