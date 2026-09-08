"use server";

import { apiFetch } from "./api-client";
import { setSessionCookie, clearSessionCookie, getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { registerSchema, loginSchema, waitlistSchema } from "./validations";

export async function registerAction(prev: unknown, formData: FormData) {
  const raw = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    inviteCode: formData.get("inviteCode") as string,
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e: any) => e.message).join("، ") };

  try {
    const data = await apiFetch<{ token: string }>("/api/auth/register", { method: "POST", body: parsed.data });
    await setSessionCookie(data.token);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect("/club");
}

export async function waitlistAction(_prev: { error?: string; success?: boolean }, formData: FormData) {
  const raw = { email: formData.get("email") as string, note: formData.get("note") as string };
  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e: any) => e.message).join("، ") };

  try {
    await apiFetch("/api/auth/waitlist", { method: "POST", body: parsed.data });
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function loginAction(prev: unknown, formData: FormData) {
  const raw = { username: formData.get("username") as string, password: formData.get("password") as string };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: "نام کاربری یا رمز عبور اشتباه است" };

  try {
    const data = await apiFetch<{ token: string }>("/api/auth/login", { method: "POST", body: parsed.data });
    await setSessionCookie(data.token);
  } catch (e: any) {
    return { error: "نام کاربری یا رمز عبور اشتباه است" };
  }
  redirect("/club");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/club/login");
}