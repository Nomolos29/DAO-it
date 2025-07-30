export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL // fallback for dev

interface ApiFetchOptions extends RequestInit {
  // Optional flag to skip JSON parsing
  skipJsonParse?: boolean;
}

/**
 * A wrapper around fetch with base URL and default options.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipJsonParse, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
    ...rest,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  if (skipJsonParse) return res as unknown as T;

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  // Otherwise return plain text (e.g., token)
  return res.text() as unknown as T;
}

export async function apiFetchWithAuth<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    throw new Error("Missing authentication tokens");
  }

  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "x-refresh-token": refreshToken,
    },
  });
}