
// "use client";

// import { useState } from "react";
// import { Loader2, Send, CheckCircle } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { projectsApi } from "@/lib/api/projects";
// import { Competence } from "@/types/competence";

// interface RejoindreProjetProps {
//   projetId: number;
//   competences: Competence[];
//   token: string;
//   demandeExistante?: boolean;
// }

// export function RejoindreProjet({
//   projetId,
//   competences,
//   token,
//   demandeExistante = false,
// }: RejoindreProjetProps) {
//   const [competenceId, setCompetenceId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [demandeEnvoyee, setDemandeEnvoyee] =
//     useState(demandeExistante);
//   const [error, setError] = useState("");

//   async function handleRejoindre() {
//     if (!competenceId) {
//       setError("Veuillez sélectionner une compétence.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await projectsApi.rejoindre(
//         projetId,
//         { competenceId },
//         token,
//       );

//       setDemandeEnvoyee(true);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Impossible d'envoyer la demande.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (demandeEnvoyee) {
//     return (
//       <Card>
//         <CardContent className="flex items-center gap-3 py-6">
//           <CheckCircle className="h-5 w-5 text-green-600" />

//           <div>
//             <p className="font-medium">
//               Demande envoyée
//             </p>

//             <p className="text-sm text-muted-foreground">
//               Votre demande est en attente de validation
//               par l&apos;administrateur.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Rejoindre le projet</CardTitle>

//         <CardDescription>
//           Sélectionnez votre compétence puis envoyez une
//           demande à l&apos;administrateur.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {error && (
//           <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
//             {error}
//           </div>
//         )}

//         <div className="space-y-2">
//           <label className="text-sm font-medium">
//             Votre compétence
//           </label>

//           <select
//             value={competenceId ?? ""}
//             onChange={(event) =>
//               setCompetenceId(
//                 event.target.value
//                   ? Number(event.target.value)
//                   : null,
//               )
//             }
//             disabled={loading}
//             className="w-full rounded-md border bg-background px-3 py-2"
//           >
//             <option value="">
//               Sélectionner une compétence
//             </option>

//             {competences.map((competence) => (
//               <option
//                 key={competence.id}
//                 value={competence.id}
//               >
//                 {competence.nom}
//               </option>
//             ))}
//           </select>
//         </div>

//         <Button
//           onClick={handleRejoindre}
//           disabled={!competenceId || loading}
//           className="w-full"
//         >
//           {loading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Envoi de la demande...
//             </>
//           ) : (
//             <>
//               <Send className="mr-2 h-4 w-4" />
//               Envoyer la demande
//             </>
//           )}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

