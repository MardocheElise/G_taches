"use client";

import {
ReactNode,
useEffect,
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

interface RoleGuardProps {
children: ReactNode;
allowedRoles: string[];
}

export function RoleGuard({
children,
allowedRoles,
}: RoleGuardProps) {
const router = useRouter();

const {
user,
loading,
} = useAuth();

const isAuthorized =
user &&
allowedRoles.includes(user.role);

useEffect(() => {
if (!loading && !isAuthorized) {
router.replace("/dashboard");
}
}, [
loading,
isAuthorized,
router,
]);

if (loading || !isAuthorized) {
return ( <div className="flex min-h-screen items-center justify-center">
Chargement... </div>
);
}

return <>{children}</>;
}
