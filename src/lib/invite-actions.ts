"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";

export async function createInviteAction(_prev: { error?: string; success?: boolean; code?: string; email?: string }, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) return { error: "ایمیل نامعتبر" };

  try {
    const data = await apiFetch<{ code: string; email: string }>("/api/invites", {
      method: "POST",
      body: { email },
      token,
    });
    return { success: true, code: data.code, email: data.email };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getMyInvitesAction() {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود", items: [] };

  try {
    const data = await apiFetch<{ code: string; invited_email: string; used_by: number | null; used_at: string | null; created_at: string }[]>("/api/invites/me", { token });
    return { items: data || [] };
  } catch {
    return { items: [] };
  }
}

export async function getInviteQuotaAction() {
  const token = await getTokenForAction();
  if (!token) return { remaining: 0, unlimited: false };

  try {
    return await apiFetch<{ remaining: number; unlimited: boolean }>("/api/invites/quota", { token });
  } catch {
    return { remaining: 0, unlimited: false };
  }
}