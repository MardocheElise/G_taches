const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL est manquant dans les variables d'environnement.",
  );
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Une erreur est survenue.",
    }));

    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message || "Une erreur est survenue.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
