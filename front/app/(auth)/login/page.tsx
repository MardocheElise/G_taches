"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
const router = useRouter();

const { login } = useAuth();

const [email, setEmail] = useState("");
const [motDePasse, setMotDePasse] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(
event: FormEvent<HTMLFormElement>
) {
event.preventDefault();

setLoading(true);
setError("");

try {
  const response = await authApi.login({
    email,
    motDePasse,
  });

  login(
    response.access_token,
    response.user
  );

  router.replace("/dashboard");
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Une erreur est survenue."
  );
} finally {
  setLoading(false);
}

}

return (
<main className="flex min-h-screen items-center justify-center p-4">
<section className="w-full max-w-md space-y-8">
<div className="text-center">
<h1 className="text-3xl font-bold">
Connexion
</h1>

      <p className="mt-2 text-muted-foreground">
        Connectez-vous à votre espace de gestion de projets.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-md border p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">
          Adresse email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motDePasse">
          Mot de passe
        </Label>

        <Input
          id="motDePasse"
          type="password"
          value={motDePasse}
          onChange={(event) =>
            setMotDePasse(event.target.value)
          }
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Connexion..."
          : "Se connecter"}
      </Button>
    </form>
  </section>
</main>

);
}