"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createStatementAction(formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const tagNames = (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const body = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    tags: tagNames,
  };

  let id: number;
  try {
    const data = await apiFetch<{ id: number }>("/api/statements", { method: "POST", body, token });
    id = data.id;
    revalidatePath("/club/statements");
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/statements/${id}`);
}

export async function counterAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const statementId = parseInt(formData.get("statementId") as string);
  try {
    await apiFetch(`/api/statements/${statementId}/counters`, {
      method: "POST",
      body: { content: formData.get("content") as string },
      token,
    });
    revalidatePath(`/club/statements/${statementId}`);
    return { error: "" };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function acceptCounterAction(prev: unknown, formData: FormData) {
  const token = await getTokenForAction();
  if (!token) return { error: "نیاز به ورود" };

  const statementId = parseInt(formData.get("statementId") as string);
  const counterId = parseInt(formData.get("counterId") as string);
  if (isNaN(statementId) || isNaN(counterId)) return { error: "اطلاعات نامعتبر" };

  let debateId: number;
  try {
    const data = await apiFetch<{ id: number }>(`/api/statements/${statementId}/counters/${counterId}/accept`, {
      method: "POST",
      token,
    });
    debateId = data.id;
    revalidatePath(`/club/statements/${statementId}`);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect(`/club/debates/${debateId}`);
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