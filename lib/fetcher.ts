// lib/fetcher.ts
/**
 * Faz fetch tanto no client quanto no server.
 * No server, monta a URL absoluta a partir da env NEXT_PUBLIC_BASE_URL
 */

const fetcher = async (path: string, init?: RequestInit) => {
  const base =
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3005'
      : '';

  const res = await fetch(`${base}${path}`, {
    // você pode passar init (method, headers, cache, etc.)
    ...init,
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
};

export default fetcher;