"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "./api-client";

const SESSION_COOKIE = "debate_session";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

export async function getSession(): Promise<{ user: { id: number; username: string; email: string; isTrusted: boolean } } | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await apiFetch("/api/auth/session", { token });
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/club/login");
  return session;
}

// These are used by auth-actions to set the cookie after Worker returns the token
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getTokenForAction(): Promise<string | null> {
  return getToken();
}