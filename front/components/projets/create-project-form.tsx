"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
useForm,
} from "react-hook-form";

import {
zodResolver,
} from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import {
projectsApi,
} from "@/lib/api/projects";

import {
createProjectSchema,
CreateProjectFormData,
} from "@/lib/validations/project";

import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";

import {
Input,
} from "@/components/ui/input";

import {
Textarea,
} from "@/components/ui/textarea";

import {
Button,
} from "@/components/ui/button";

export function CreateProjectForm() {
const router = useRouter();

const { token } = useAuth();

const [serverError, setServerError] =
useState("");

const form =
useForm<CreateProjectFormData>({
resolver: zodResolver(
createProjectSchema,
),


  defaultValues: {
    nom: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    nombreMembresMax: 1,
  },
});


async function onSubmit(
data: CreateProjectFormData,
) {
if (!token) {
return;
}


try {
  setServerError("");

  const project =
    await projectsApi.create(
      {
        ...data,

        description:
          data.description || undefined,

        dateFin:
          data.dateFin || undefined,
      },

      token,
    );

  router.push(
    `/projects/${project.id}`,
  );
} catch (error) {
  setServerError(
    error instanceof Error
      ? error.message
      : "Impossible de créer le projet.",
  );
}


}

return (
<Form {...form}>
<form
onSubmit={form.handleSubmit(
onSubmit,
)}
className="space-y-6"
>
<FormField
control={form.control}
name="nom"
render={({ field }) => ( <FormItem> <FormLabel>
Nom du projet </FormLabel>


          <FormControl>
            <Input
              placeholder="Ex. Application de gestion des tâches"
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Description
          </FormLabel>

          <FormControl>
            <Textarea
              placeholder="Décrivez le projet..."
              className="min-h-32"
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="dateDebut"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Date de début
            </FormLabel>

            <FormControl>
              <Input
                type="date"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dateFin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Date de fin
              {" (optionnelle)"}
            </FormLabel>

            <FormControl>
              <Input
                type="date"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="nombreMembresMax"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Nombre maximum de membres
          </FormLabel>

          <FormControl>
            <Input
              type="number"
              min={1}
              {...field}
              onChange={(event) =>
                field.onChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />

    {serverError && (
      <p className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        {serverError}
      </p>
    )}

    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          router.back()
        }
      >
        Annuler
      </Button>

      <Button
        type="submit"
        disabled={
          form.formState.isSubmitting
        }
      >
        {form.formState.isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        Créer le projet
      </Button>
    </div>
  </form>
</Form>


);
}
