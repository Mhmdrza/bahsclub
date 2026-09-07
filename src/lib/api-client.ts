const WORKER_URL = process.env.WORKER_API_URL!;
const DEFAULT_TIMEOUT = 10000;

interface FetchOpts {
  method?: string;
  body?: unknown;
  token?: string | null;
  timeout?: number;
}

async function doFetch<T>(path: string, method: string, headers: Record<string, string>, body: string | undefined, timeout: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${WORKER_URL}${path}`, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json() as { error?: string } & T;
    if (!res.ok) throw new Error(data.error || "خطا در ارتباط با سرور");
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch<T = any>(path: string, opts?: FetchOpts): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const timeout = opts?.timeout ?? DEFAULT_TIMEOUT;
  const method = opts?.method || "GET";
  const body = opts?.body ? JSON.stringify(opts.body) : undefined;

  try {
    return await doFetch<T>(path, method, headers, body, timeout);
  } catch (e: any) {
    if (e.name === "AbortError") throw new Error("زمان درخواست منقضی شد");

    // ponytail: single retry for idempotent GET; add configurable retry with backoff if transient errors grow
    if (method === "GET") {
      try {
        return await doFetch<T>(path, method, headers, undefined, timeout);
      } catch {
        // both attempts failed, fall through
      }
    }

    throw e;
  }
}