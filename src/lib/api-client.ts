const WORKER_URL = process.env.WORKER_API_URL!;

interface FetchOpts {
  method?: string;
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T = any>(path: string, opts?: FetchOpts): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const res = await fetch(`${WORKER_URL}${path}`, {
    method: opts?.method || "GET",
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  const data = await res.json() as { error?: string } & T;
  if (!res.ok) throw new Error(data.error || "خطا در ارتباط با سرور");
  return data as T;
}