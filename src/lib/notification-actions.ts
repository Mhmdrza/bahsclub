"use server";

import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";

export async function markNotifsReadAction() {
  const token = await getTokenForAction();
  if (!token) return;
  await apiFetch("/api/users/me/notifications/read", { method: "POST", token });
}