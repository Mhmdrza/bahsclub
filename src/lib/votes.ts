"use server";

import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";

export async function toggleVote(voteableType: string, voteableId: number) {
  const token = await getTokenForAction();
  if (!token) throw new Error("نیاز به ورود");
  return apiFetch<{ voted: boolean }>("/api/votes/toggle", { method: "POST", body: { voteableType, voteableId }, token });
}