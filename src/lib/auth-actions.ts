"use server";

import { apiFetch } from "./api-client";
import { setSessionCookie, clearSessionCookie, getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { registerSchema, loginSchema } from "./validations";

export async function registerAction(prev: unknown, formData: FormData) {
  const raw = { username: formData.get("username") as string, email: formData.get("email") as string, password: formData.get("password") as string };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e: any) => e.message).join("، ") };

  try {
    const data = await apiFetch<{ token: string }>("/api/auth/register", { method: "POST", body: parsed.data });
    await setSessionCookie(data.token);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect("/debate");
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
  redirect("/debate");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/debate/login");
}