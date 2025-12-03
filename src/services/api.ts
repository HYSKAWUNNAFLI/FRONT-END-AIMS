const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL not set; using mock data.');
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = { fetchJson, API_BASE_URL };
