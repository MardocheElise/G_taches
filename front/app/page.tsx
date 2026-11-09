"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authStorage } from "@/lib/auth";

export default function Home() {
const router = useRouter();

useEffect(() => {
if (authStorage.isAuthenticated()) {
router.replace("/dashboard");
} else {
router.replace("/login");
}
}, [router]);

return (
<div className="flex min-h-screen items-center justify-center">
Chargement...
</div>
);
}