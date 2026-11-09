"use client";

import { useRouter } from "next/navigation";

import {
ArrowLeft,
FolderPlus,
} from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";

import {
CreateProjectForm,
} from "@/components/projets/create-project-form";

import {
Button,
} from "@/components/ui/button";

export default function CreateProjectPage() {
const router = useRouter();

return (
<RoleGuard
allowedRoles={["SUPER_ADMIN"]}
> <div className="mx-auto max-w-3xl space-y-6"> <div>
<Button
variant="ghost"
size="sm"
className="mb-4"
onClick={() =>
router.push("/projects")
}
> <ArrowLeft className="mr-2 h-4 w-4" />


        Retour aux projets
      </Button>

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <FolderPlus className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Créer un projet
          </h1>

          <p className="text-sm text-muted-foreground">
            Créez un nouveau projet sur la plateforme.
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-lg border p-6">
      <CreateProjectForm />
    </div>
  </div>
</RoleGuard>


);
}
