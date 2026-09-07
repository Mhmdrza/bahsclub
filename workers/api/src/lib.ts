const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const saltBytes = salt || crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
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

export function getAuthToken(c: any): string | null {
  const auth = c.req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export async function getCurrentUser(DB: D1Database, token: string | null): Promise<{ id: number; username: string; email: string; isTrusted: boolean } | null> {
  if (!token) return null;
  const session = await DB.prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?').bind(token).first<any>();
  if (!session || new Date(session.expires_at) < new Date()) {
    if (session) await DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
    return null;
  }
  const user = await DB.prepare('SELECT id, username, email, is_trusted FROM users WHERE id = ?').bind(session.user_id).first<any>();
  return user ? { id: user.id, username: user.username, email: user.email, isTrusted: !!user.is_trusted } : null;
}

export function needAuth(user: any) {
  if (!user) return new Response(JSON.stringify({ error: 'نیاز به ورود' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  return null;
}

export function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { 'Content-Type': 'application/json' } });
}

export function ok(data: any) {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}