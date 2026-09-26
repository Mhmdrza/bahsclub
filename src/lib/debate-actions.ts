"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createChallengeAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const tagNames = [...new Set(formData.getAll("tags").map((t) => String(t).trim()).filter(Boolean))];
  const body = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    tags: tagNames,
  };

  let id: number;
  try {
    const data = await apiFetch<{ id: number }>("/api/challenges", { method: "POST", body, token });
    id = data.id;
    revalidatePath("/club/challenges");
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/challenges/${id}`);
}

export async function responseAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const challengeId = parseInt(formData.get("challengeId") as string);
  try {
    await apiFetch(`/api/challenges/${challengeId}/responses`, {
      method: "POST",
      body: { content: formData.get("content") as string },
      token,
    });
    revalidatePath(`/club/challenges/${challengeId}`);
    return { error: "" };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function startDebateFromResponseAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const challengeId = parseInt(formData.get("challengeId") as string);
  const responseId = parseInt(formData.get("responseId") as string);
  if (isNaN(challengeId) || isNaN(responseId)) return { error: "اطلاعات نامعتبر" };

  let debateId: number;
  try {
    const data = await apiFetch<{ id: number }>(`/api/challenges/${challengeId}/responses/${responseId}/debate`, {
      method: "POST",
      token,
    });
    debateId = data.id;
    revalidatePath(`/club/challenges/${challengeId}`);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/debates/${debateId}`);
}

export async function acceptChallengeAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const challengeId = parseInt(formData.get("challengeId") as string);
  if (isNaN(challengeId)) return { error: "اطلاعات نامعتبر" };

  let debateId: number;
  try {
    const data = await apiFetch<{ id: number }>(`/api/challenges/${challengeId}/debate`, {
      method: "POST",
      body: { content: formData.get("content") as string },
      token,
    });
    debateId = data.id;
    revalidatePath(`/club/challenges/${challengeId}`);
    revalidatePath("/club/debates");
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/debates/${debateId}`);
}

// One composer, two intents: "debate" starts immediately, "response" files a proposal.
export async function respondToChallengeAction(prev: unknown, formData: FormData) {
  if (formData.get("intent") !== "response") {
    return acceptChallengeAction(prev, formData);
  }
  const res = await responseAction(prev, formData);
  return { error: res?.error || "", success: !res?.error };
}

export async function postMessageAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

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
  if (!token) return { error: "نیاز به ورود" };

  const debateId = parseInt(formData.get("debateId") as string);
  try {
    const result = await apiFetch<{ status: "requested" | "closed" }>(`/api/debates/${debateId}/closure`, { method: "POST", token });
    revalidatePath(`/club/debates/${debateId}`);
    return { error: "", closureStatus: result.status };
  } catch (e: any) {
    return { error: e.message };
  }
}