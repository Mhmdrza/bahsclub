"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createDebateAction(formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const tagNames = (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const body = {
    title: formData.get("title") as string,
    initialStatement: formData.get("initialStatement") as string,
    tags: tagNames,
  };

  try {
    const data = await apiFetch<{ id: number }>("/api/debates", { method: "POST", body, token });
    revalidatePath("/debate/debates");
    redirect(`/debate/debates/${data.id}`);
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function challengeAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    await apiFetch(`/api/debates/${debateId}/challenge`, {
      method: "POST",
      body: { positionStatement: formData.get("positionStatement") as string },
      token,
    });
    revalidatePath(`/debate/debates/${debateId}`);
    return { error: "" };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function acceptChallengerAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const debateId = parseInt(formData.get("debateId") as string);
  const challengerUserId = parseInt(formData.get("challengerUserId") as string);
  const firstSpeakerId = parseInt(formData.get("firstSpeakerId") as string);
  if (isNaN(debateId) || isNaN(challengerUserId)) return { error: "اطلاعات نامعتبر" };

  try {
    await apiFetch(`/api/debates/${debateId}/accept`, {
      method: "POST",
      body: { challengerUserId, firstSpeakerId },
      token,
    });
    revalidatePath(`/debate/debates/${debateId}`);
    redirect(`/debate/debates/${debateId}`);
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function postTurnAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    await apiFetch(`/api/debates/${debateId}/turn`, {
      method: "POST",
      body: { content: formData.get("content") as string },
      token,
    });
    revalidatePath(`/debate/debates/${debateId}`);
    return { error: "" };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function requestClosureAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    await apiFetch(`/api/debates/${debateId}/closure`, { method: "POST", token });
    revalidatePath(`/debate/debates/${debateId}`);
    return { error: "" };
  } catch (e: any) {
    return { error: e.message };
  }
}