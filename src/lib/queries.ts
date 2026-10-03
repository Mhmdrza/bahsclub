import { apiFetch } from "./api-client";
import { getTokenForAction } from "./session";

function mapDebate(d: any) {
  return {
    id: d.id,
    ideaId: d.idea_id ?? d.challenge_id,
    responseId: d.response_id ?? d.counter_response_id,
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

function mapResponse(c: any) {
  return {
    id: c.id,
    ideaId: c.idea_id,
    userId: c.user_id,
    kind: c.kind || "reply",
    content: c.content,
    status: c.status,
    moderationState: c.moderation_state || "normal",
    createdAt: c.created_at,
    username: c.username,
    voteCount: c.voteCount || 0,
    userVoted: c.userVoted || false,
    debateId: c.debate_id || null,
    debateStatus: c.debate_status || null,
  };
}

function mapIdea(s: any) {
  return {
    id: s.id,
    userId: s.user_id,
    username: s.username,
    title: s.title,
    reasoning: s.reasoning ?? s.content ?? "",
    confidence: s.confidence ?? 50,
    sources: s.sources || "",
    falsifier: s.falsifier || "",
    openToResponse: s.open_to_response === 1 || s.open_to_response === true,
    moderationState: s.moderation_state || "normal",
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    voteCount: s.vote_count || 0,
    responseCount: s.response_count || 0,
    challengeCount: s.challenge_count || 0,
    activeDebateCount: s.active_debate_count || 0,
    versionCount: s.version_count || 1,
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
    const data = await apiFetch<{ items: any[]; pagination: Pagination }>(`/api/debates${qs ? "?" + qs : ""}`, { token });
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

export async function getIdeas(opts?: { tag?: string; username?: string; feed?: "home" | "following"; page?: number }) {
  const token = await getTokenForAction();
  const params = new URLSearchParams();
  if (opts?.tag) params.set("tag", opts.tag);
  if (opts?.username) params.set("username", opts.username);
  if (opts?.feed) params.set("feed", opts.feed);
  if (opts?.page) params.set("page", String(opts.page));
  params.set("limit", "20");
  const qs = params.toString();

  try {
    const data = await apiFetch<{ items: any[]; pagination: Pagination; feed?: string }>(`/api/ideas${qs ? "?" + qs : ""}`, { token });
    return {
      ideas: (data.items || []).map(mapIdea),
      pagination: data.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
      feed: data.feed,
    };
  } catch {
    return { ideas: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false }, feed: undefined };
  }
}

export async function getTags() {
  const token = await getTokenForAction();
  try {
    const data = await apiFetch<{ items: any[] }>("/api/tags?limit=100", { token });
    return (data.items || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t.idea_count || 0,
    }));
  } catch {
    return [];
  }
}

export async function getIdeaDetail(id: number) {
  const token = await getTokenForAction();
  try {
    const data = await apiFetch<any>(`/api/ideas/${id}`, { token });
    if (!data || !data.idea) return null;

    return {
      idea: mapIdea(data.idea),
      creator: data.creator ? { id: data.creator.id, username: data.creator.username, bio: data.creator.bio } : null,
      tags: (data.tags || []).map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
      versions: (data.versions || []).map((v: any) => ({
        id: v.id,
        version: v.version,
        title: v.title,
        reasoning: v.reasoning,
        confidence: v.confidence,
        sources: v.sources,
        falsifier: v.falsifier,
        createdAt: v.created_at,
      })),
      responses: (data.responses || []).map(mapResponse),
      debates: data.debates || [],
      ideaVoteCount: data.voteCount || 0,
      ideaVoted: !!data.voted,
      isFollowingAuthor: !!data.isFollowingAuthor,
      authorFollowerCount: data.authorFollowerCount || 0,
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

export interface NotifItem {
  id: number;
  type: string;
  referenceType: string;
  referenceId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotifItem[]> {
  const token = await getTokenForAction();
  if (!token) return [];
  try {
    const data = await apiFetch<any>("/api/users/me/notifications", { token });
    return (data || []).map((n: any) => ({
      id: n.id,
      type: n.type,
      referenceType: n.reference_type,
      referenceId: n.reference_id,
      message: n.message,
      isRead: !!n.is_read,
      createdAt: n.created_at,
    }));
  } catch {
    return [];
  }
}

export async function markNotificationsRead(): Promise<boolean> {
  const token = await getTokenForAction();
  if (!token) return false;
  try {
    await apiFetch("/api/users/me/notifications/read", { method: "POST", token });
    return true;
  } catch {
    return false;
  }
}
