import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";

function mapDebate(d: any) {
  return {
    id: d.id,
    statementId: d.statement_id,
    counterStatementId: d.counter_statement_id,
    title: d.title,
    status: d.status,
    creatorId: d.creator_id,
    opponentId: d.opponent_id,
    creatorUsername: d.creator_username,
    closureRequestedBy: d.closure_requested_by,
    closedReason: d.closed_reason,
    closedAt: d.closed_at,
    moderationState: d.moderation_state || "normal",
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function mapMessage(m: any) {
  return {
    id: m.id,
    debateId: m.debate_id,
    userId: m.user_id,
    content: m.content,
    moderationState: m.moderation_state || "normal",
    createdAt: m.created_at,
    username: m.username,
    voteCount: m.voteCount || 0,
    userVoted: m.userVoted || false,
  };
}

function mapCounter(c: any) {
  return {
    id: c.id,
    statementId: c.statement_id,
    userId: c.user_id,
    content: c.content,
    status: c.status,
    moderationState: c.moderation_state || "normal",
    createdAt: c.created_at,
    username: c.username,
    voteCount: c.voteCount || 0,
    userVoted: c.userVoted || false,
  };
}

function mapStatement(s: any) {
  return {
    id: s.id,
    userId: s.user_id,
    username: s.username,
    title: s.title,
    content: s.content,
    moderationState: s.moderation_state || "normal",
    createdAt: s.created_at,
    voteCount: s.vote_count || 0,
    counterCount: s.counter_count || 0,
    activeDebateCount: s.active_debate_count || 0,
    tags: s.tags || [],
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
        messageCount: d.message_count || 0,
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
      messages: (data.messages || []).map(mapMessage),
      debateVoteCount: data.debateVoteCount || 0,
      debateVoted: !!data.debateVoted,
      session: data.user ? { user: data.user } : null,
    };
  } catch {
    return null;
  }
}

export async function getStatements(opts?: { tag?: string; username?: string; page?: number }) {
  const token = await getTokenForAction();
  const params = new URLSearchParams();
  if (opts?.tag) params.set("tag", opts.tag);
  if (opts?.username) params.set("username", opts.username);
  if (opts?.page) params.set("page", String(opts.page));
  params.set("limit", "20");
  const qs = params.toString();

  try {
    const data = await apiFetch<{ items: any[]; pagination: Pagination }>(`/api/statements${qs ? "?" + qs : ""}`, { token });
    return {
      statements: (data.items || []).map(mapStatement),
      pagination: data.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
    };
  } catch {
    return { statements: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
  }
}

export async function getStatementDetail(id: number) {
  const token = await getTokenForAction();
  try {
    const data = await apiFetch<any>(`/api/statements/${id}`, { token });
    if (!data || !data.statement) return null;

    return {
      statement: mapStatement(data.statement),
      creator: data.creator ? { id: data.creator.id, username: data.creator.username } : null,
      tags: (data.tags || []).map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
      counters: (data.counters || []).map(mapCounter),
      debates: data.debates || [],
      statementVoteCount: data.statementVoteCount || 0,
      statementVoted: !!data.statementVoted,
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