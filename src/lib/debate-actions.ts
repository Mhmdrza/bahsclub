"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createIdeaAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const tagNames = [...new Set(formData.getAll("tags").map((t) => String(t).trim()).filter(Boolean))];
  const body = {
    title: formData.get("title") as string,
    reasoning: formData.get("reasoning") as string,
    confidence: Number(formData.get("confidence") || 50),
    sources: (formData.get("sources") as string) || "",
    falsifier: (formData.get("falsifier") as string) || "",
    tags: tagNames,
    openToResponse: formData.get("openToResponse") === "true",
  };

  let id: number;
  try {
    const data = await apiFetch<{ id: number }>("/api/ideas", { method: "POST", body, token });
    id = data.id;
    revalidatePath("/club");
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/ideas/${id}`);
}

// Author edits their idea; the API appends a new version (full history kept).
export async function updateIdeaAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const id = parseInt(formData.get("ideaId") as string);
  if (isNaN(id)) return { error: "اطلاعات نامعتبر" };

  const tagNames = [...new Set(formData.getAll("tags").map((t) => String(t).trim()).filter(Boolean))];
  const body = {
    title: formData.get("title") as string,
    reasoning: formData.get("reasoning") as string,
    confidence: Number(formData.get("confidence") || 50),
    sources: (formData.get("sources") as string) || "",
    falsifier: (formData.get("falsifier") as string) || "",
    openToResponse: formData.get("openToResponse") === "true",
    ...(tagNames.length ? { tags: tagNames } : {}),
  };

  try {
    await apiFetch(`/api/ideas/${id}`, { method: "PATCH", body, token });
    revalidatePath(`/club/ideas/${id}`);
    return { error: "", success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// One composer, two intents: a free reply, or a structured challenge.
export async function respondToIdeaAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const ideaId = parseInt(formData.get("ideaId") as string);
  const kind = formData.get("kind") === "challenge" ? "challenge" : "reply";
  if (isNaN(ideaId)) return { error: "اطلاعات نامعتبر" };

  try {
    await apiFetch(`/api/ideas/${ideaId}/responses`, {
      method: "POST",
      body: { content: formData.get("content") as string, kind },
      token,
    });
    revalidatePath(`/club/ideas/${ideaId}`);
    return { error: "", success: true, kind };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function startDebateFromResponseAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const ideaId = parseInt(formData.get("ideaId") as string);
  const responseId = parseInt(formData.get("responseId") as string);
  if (isNaN(ideaId) || isNaN(responseId)) return { error: "اطلاعات نامعتبر" };

  let debateId: number;
  try {
    const data = await apiFetch<{ id: number }>(`/api/ideas/${ideaId}/responses/${responseId}/debate`, {
      method: "POST",
      token,
    });
    debateId = data.id;
    revalidatePath(`/club/ideas/${ideaId}`);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/debates/${debateId}`);
}

// Follow / unfollow a user. `follow` = "true" to follow, otherwise unfollow.
export async function toggleFollowAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const username = formData.get("username") as string;
  const follow = formData.get("follow") === "true";
  try {
    await apiFetch(`/api/users/${username}/follow`, { method: follow ? "POST" : "DELETE", token });
    revalidatePath(`/club/users/${username}`);
    revalidatePath("/club");
    return { error: "", following: follow };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function postMessageAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    const result = await apiFetch<{ success: boolean; closureWiped?: boolean }>(`/api/debates/${debateId}/message`, {
      method: "POST",
      body: { content: formData.get("content") as string },
      token,
    });
    revalidatePath(`/club/debates/${debateId}`);
    return { error: "", closureWiped: !!result.closureWiped };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function requestClosureAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "برای ادامه وارد شوید" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    const result = await apiFetch<{ status: "requested" | "closed" }>(`/api/debates/${debateId}/closure`, { method: "POST", token });
    revalidatePath(`/club/debates/${debateId}`);
    return { error: "", closureStatus: result.status };
  } catch (e: any) {
    return { error: e.message };
  }
}
