     "use client";

     import { useEffect, useState } from "react";

     import { useRouter } from "next/navigation";

     import {
     useForm,
     } from "react-hook-form";

     import {
     zodResolver,
     } from "@hookform/resolvers/zod";

     import {
     Loader2,
     } from "lucide-react";

     import {
     ProjetDetail,
     } from "@/types/projet";

     import {
     projectsApi,
     } from "@/lib/api/projects";

     import {
     createProjectSchema,
     CreateProjectFormData,
     } from "@/lib/validations/project";

     import {
     useAuth,
     } from "@/components/providers/auth-provider";

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

     interface EditProjectFormProps {
     project: ProjetDetail;
     }

     function formatDateForInput(
     date: string | null,
     ) {
     if (!date) {
     return "";
     }

     return new Date(date)
     .toISOString()
     .split("T")[0];
     }

     export function EditProjectForm({
     project,
     }: EditProjectFormProps) {
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
     nom: project.nom,
     description:
          project.description ?? "",
     dateDebut:
          formatDateForInput(
          project.dateDebut,
          ),
     dateFin:
          formatDateForInput(
          project.dateFin,
          ),
     nombreMembresMax:
          project.nombreMembresMax,
     },
     });


     useEffect(() => {
     form.reset({
     nom: project.nom,
     description:
     project.description ?? "",
     dateDebut:
     formatDateForInput(
     project.dateDebut,
     ),
     dateFin:
     formatDateForInput(
     project.dateFin,
     ),
     nombreMembresMax:
     project.nombreMembresMax,
     });
     }, [project, form]);

     async function onSubmit(
     data: CreateProjectFormData,
     ) {
     if (!token) {
     return;
     }


     try {
     setServerError("");

     await projectsApi.update(
     project.id,
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

     router.refresh();
     } catch (error) {
     setServerError(
     error instanceof Error
          ? error.message
          : "Impossible de modifier le projet.",
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
               <Input {...field} />
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
               router.push(
               `/projects/${project.id}`,
               )
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

          Enregistrer les modifications
          </Button>
     </div>
     </form>
     </Form>


     );
     }
