const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

const ALLOWED_ORIGIN = "*";

function corsHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: corsHeaders() });
}

export function ok(data: any) {
  return new Response(JSON.stringify(data), { headers: corsHeaders() });
}

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const saltBytes = salt || crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password) as any, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes as any, iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltStr = btoa(String.fromCharCode(...saltBytes));
  return { hash, salt: saltStr };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const saltBytes = new Uint8Array(atob(storedSalt).split('').map(c => c.charCodeAt(0)));
  const { hash } = await hashPassword(password, saltBytes);
  return hash === storedHash;
}

export async function createSession(DB: D1Database, userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  await DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(token, userId, expiresAt).run();
  return token;
}

export async function deleteUserSessions(DB: D1Database, userId: number): Promise<void> {
  await DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
}

export function getAuthToken(c: any): string | null {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export interface DbUser {
  id: number;
  username: string;
  email: string;
  isTrusted: boolean;
  role: string;
  reputation: number;
  repLocked: boolean;
  blockedUntil: string | null;
}

export async function getCurrentUser(DB: D1Database, token: string | null): Promise<DbUser | null> {
  if (!token) return null;
  const session = await DB.prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?').bind(token).first<any>();
  if (!session || new Date(session.expires_at) < new Date()) {
    if (session) await DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
    return null;
  }
  const user = await DB.prepare('SELECT id, username, email, is_trusted, role, reputation, rep_locked, blocked_until FROM users WHERE id = ?').bind(session.user_id).first<any>();
  return user ? {
    id: user.id, username: user.username, email: user.email,
    isTrusted: !!user.is_trusted, role: user.role, reputation: user.reputation,
    repLocked: !!user.rep_locked, blockedUntil: user.blocked_until,
  } : null;
}

export function needAuth(user: any) {
  if (!user) return err("نیاز به ورود", 401);
  return null;
}

export function needJudge(user: DbUser | null) {
  if (!user || user.role !== 'judge') return err('فقط داوران اجازه دسترسی دارند', 403);
  return null;
}

export function ensureNotBlocked(user: DbUser) {
  if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
    const until = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date(user.blockedUntil));
    return err(`حساب شما تا ${until} مسدود شده است`, 403);
  }
  return null;
}

// ponytail: in-memory rate limiter, per-isolate; use D1-backed or Durable Objects for distributed accuracy
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }
  if (entry.count >= maxRequests) return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  entry.count++;
  return { limited: false };
}

export function isStrongPassword(password: string): string | null {
  if (password.length < 8) return "رمز عبور حداقل ۸ حرف";
  if (!/[a-zA-Z]/.test(password)) return "رمز عبور باید شامل حروف باشد";
  if (!/[0-9]/.test(password)) return "رمز عبور باید شامل عدد باشد";
  return null;
}

export function getClientIp(c: any): string {
  return c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "unknown";
}

export function getPagination(query: Record<string, string | undefined>, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, parseInt(query.page || "1"));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit))));
  return { page, limit, offset: (page - 1) * limit };
}

export function paginatedResponse(items: any[], page: number, limit: number, total: number) {
  return ok({
    items: items,
    pagination: { page, limit, total, hasMore: page * limit < total },
  });
}