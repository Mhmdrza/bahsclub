"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";
import { revalidatePath } from "next/cache";

export async function flagAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  try {
    await apiFetch("/api/flags", {
      method: "POST",
      body: {
        flaggableType: formData.get("flaggableType") as string,
        flaggableId: parseInt(formData.get("flaggableId") as string),
        reason: formData.get("reason") as string,
        details: (formData.get("details") as string) || undefined,
      },
      token,
    });
    return { ok: true as const };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function resolveFlagsAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  try {
    await apiFetch("/api/flags/resolve", {
      method: "POST",
      body: {
        flaggableType: formData.get("flaggableType") as string,
        flaggableId: parseInt(formData.get("flaggableId") as string),
        userAction: formData.get("userAction") as string,
        contentAction: (formData.get("contentAction") as string) || undefined,
        note: (formData.get("note") as string) || undefined,
        durationDays: formData.get("durationDays") ? parseInt(formData.get("durationDays") as string) : undefined,
        repDelta: formData.get("repDelta") ? parseInt(formData.get("repDelta") as string) : undefined,
      },
      token,
    });
    revalidatePath("/club/judge");
    revalidatePath("/club");
    return { ok: true as const };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateBioAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const username = formData.get("username") as string;
  try {
    await apiFetch("/api/users/me", {
      method: "PATCH",
      body: { bio: formData.get("bio") as string },
      token,
    });
    revalidatePath(`/club/users/${username}`);
    return { ok: true as const };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function acknowledgeWarningsAction() {
  const token = await getTokenForAction();
  if (!token) return;
  await apiFetch("/api/users/me/acknowledge-warnings", { method: "POST", token });
  revalidatePath("/club");
}