"use client";

import { useAuth } from "@/components/providers/auth-provider";

import {
AdminDashboard,
} from "@/components/dashboard/admin-dashboard";

import {
UserDashboard,
} from "@/components/dashboard/user-dashboard";

export default function DashboardPage() {
const { user } = useAuth();

if (user?.role === "SUPER_ADMIN") {
return <AdminDashboard />;
}

return <UserDashboard />;
}
