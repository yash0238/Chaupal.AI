/**
 * Small typed fetch helper for talking to the KrisiSar AI backend.
 * Adds a timeout so the UI never hangs if the backend restarts or is down.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {}

interface ApiOptions {
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs?: number;
}

/**
 * Calls the backend and unwraps the standard { success, data, error } envelope.
 * Returns `data` on success, throws ApiError with a friendly message otherwise.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, timeoutMs = 90_000 }: ApiOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    let json: { success?: boolean; data?: T; error?: string } | null = null;
    try {
      json = await res.json();
    } catch {
      // non-JSON response
    }

    if (!res.ok) {
      throw new ApiError(
        json?.error ?? `Server responded ${res.status}. Check the backend logs.`
      );
    }
    if (json?.success === false) {
      throw new ApiError(json.error ?? "Request failed.");
    }
    return (json?.data ?? json) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "The request timed out. The backend may be restarting — check the server terminal and try again."
      );
    }
    if (err instanceof TypeError) {
      throw new ApiError(
        `Could not reach the backend at ${API_URL}. Is the FastAPI server running (python main.py)?`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Reverse-geocode coordinates to a human place name using BigDataCloud's
 * free client-side endpoint (no API key, CORS-enabled). Falls back to the
 * raw coordinates if the lookup fails.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!res.ok) return fallback;
    const d = await res.json();
    const parts = [
      d.locality || d.city,
      d.principalSubdivision, // state
      d.countryName,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : fallback;
  } catch {
    return fallback;
  }
}

/** Promisified browser geolocation with a sensible fallback. */
export function getLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      // Fallback: New Delhi
      resolve({ lat: 28.6139, lng: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: 28.6139, lng: 77.209 }), // denied/failed -> fallback
      { timeout: 8000 }
    );
  });
}
