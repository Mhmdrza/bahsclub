import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";

function mapDebate(d: any) {
  return {
    id: d.id,
    title: d.title,
    status: d.status,
    currentTurn: d.current_turn ?? 0,
    maxTurns: d.max_turns ?? 10,
    initialStatement: d.initial_statement,
    creatorId: d.creator_id,
    opponentId: d.opponent_id,
    creatorUsername: d.creator_username,
    nextSpeaker: d.next_speaker,
    closureRequestedBy: d.closure_requested_by,
    closedReason: d.closed_reason,
    closedAt: d.closed_at,
    moderationState: d.moderation_state || "normal",
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function mapTurn(t: any) {
  return {
    id: t.id,
    debateId: t.debate_id,
    userId: t.user_id,
    turnNumber: t.turn_number,
    content: t.content,
    moderationState: t.moderation_state || "normal",
    createdAt: t.created_at,
    username: t.username,
    voteCount: t.voteCount || 0,
    userVoted: t.userVoted || false,
  };
}

function mapChallenger(c: any) {
  return {
    id: c.id,
    debateId: c.debate_id,
    userId: c.user_id,
    positionStatement: c.position_statement,
    status: c.status,
    createdAt: c.created_at,
    username: c.username,
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export async function getDebatesWithVotes(opts?: { tag?: string; status?: string; page?: number }) {
  const token = await getTokenForAction();
  const params = new URLSearchParams();
  if (opts?.tag) params.set("tag", opts.tag);
  if (opts?.status) params.set("status", opts.status);
  if (opts?.page) params.set("page", String(opts.page));
  params.set("limit", "20");
  const qs = params.toString();

  try {
    const data = await apiFetch<{ items: any[]; pagination: { page: number; limit: number; total: number; hasMore: boolean } }>(`/api/debates${qs ? "?" + qs : ""}`, { token });
    return {
      debates: (data.items || []).map((d: any) => ({
        debate: mapDebate(d),
        creator: { username: d.creator_username },
        voteCount: d.vote_count || 0,
        turnCount: d.current_turn || 0,
        tags: [],
      })),
      pagination: data.pagination,
    };
  } catch {
    return { debates: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
  }
}

export async function getDebateDetail(debateId: number) {
  const token = await getTokenForAction();
  try {
    const data = await apiFetch<any>(`/api/debates/${debateId}`, { token });
    if (!data || !data.debate) return null;

    return {
      debate: mapDebate(data.debate),
      creator: data.creator ? { id: data.creator.id, username: data.creator.username } : null,
      opponent: data.opponent ? { id: data.opponent.id, username: data.opponent.username } : null,
      tags: (data.tags || []).map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
      turns: (data.turns || []).map(mapTurn),
      pendingChallengers: (data.pendingChallengers || []).map(mapChallenger),
      debateVoteCount: data.debateVoteCount || 0,
      debateVoted: !!data.debateVoted,
      session: data.user ? { user: data.user } : null,
    };
  } catch {
    return null;
  }
}

export async function getUserProfile(username: string) {
  const token = await getTokenForAction();
  try {
    const data = await apiFetch<any>(`/api/users/${username}`, { token });
    if (!data || !data.username) return null;
    return data;
  } catch {
    return null;
  }
}