import { describe, it, expect, beforeEach } from "vitest";
import { env, SELF } from "cloudflare:test";

const PW = "StrongPass123!";

let ipCounter = 0;
async function register(username: string): Promise<string> {
  const res = await SELF.fetch("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": `10.0.0.${++ipCounter}` },
    body: JSON.stringify({ username, email: `${username}@example.com`, password: PW }),
  });
  expect(res.status).toBe(200);
  return (await res.json<{ token: string }>()).token;
}

async function publishIdea(token: string, overrides: Record<string, unknown> = {}): Promise<number> {
  const res = await SELF.fetch("http://localhost/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: "A test idea",
      reasoning: "x".repeat(60),
      confidence: 60,
      tags: ["logic"],
      ...overrides,
    }),
  });
  expect(res.status).toBe(200);
  return (await res.json<{ id: number }>()).id;
}

beforeEach(async () => {
  await env.DB.exec(
    "DELETE FROM notifications; DELETE FROM follows; DELETE FROM debate_messages; DELETE FROM debate_tags; DELETE FROM debates; DELETE FROM idea_responses; DELETE FROM idea_tags; DELETE FROM idea_versions; DELETE FROM ideas; DELETE FROM tags; DELETE FROM sessions; DELETE FROM users;"
  );
});

describe("POST /api/ideas", () => {
  it("publishes an idea and records version 1", async () => {
    const token = await register("author_a");
    const id = await publishIdea(token);

    const version = await env.DB.prepare("SELECT version, confidence FROM idea_versions WHERE idea_id = ?").bind(id).first<{ version: number; confidence: number }>();
    expect(version!.version).toBe(1);
    expect(version!.confidence).toBe(60);
  });

  it("rejects short reasoning and out-of-range confidence", async () => {
    const token = await register("author_b");
    const short = await SELF.fetch("http://localhost/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: "A test idea", reasoning: "short", confidence: 60, tags: ["logic"] }),
    });
    expect(short.status).toBe(400);
  });
});

describe("PATCH /api/ideas/:id", () => {
  it("appends a version on edit", async () => {
    const token = await register("author_c");
    const id = await publishIdea(token);
    const res = await SELF.fetch(`http://localhost/api/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ confidence: 40, reasoning: "y".repeat(60) }),
    });
    expect(res.status).toBe(200);
    const count = await env.DB.prepare("SELECT COUNT(*) AS c FROM idea_versions WHERE idea_id = ?").bind(id).first<{ c: number }>();
    expect(count!.c).toBe(2);
  });

  it("refuses edits from non-authors", async () => {
    const authorToken = await register("author_d");
    const id = await publishIdea(authorToken);
    const otherToken = await register("other_d");
    const res = await SELF.fetch(`http://localhost/api/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${otherToken}` },
      body: JSON.stringify({ confidence: 40 }),
    });
    expect(res.status).toBe(403);
  });
});

describe("idea responses", () => {
  it("accepts a reply and a structured challenge", async () => {
    const authorToken = await register("author_e");
    const id = await publishIdea(authorToken);
    const otherToken = await register("other_e");

    const reply = await SELF.fetch(`http://localhost/api/ideas/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${otherToken}` },
      body: JSON.stringify({ content: "x".repeat(40), kind: "reply" }),
    });
    expect(reply.status).toBe(200);

    const challenge = await SELF.fetch(`http://localhost/api/ideas/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${otherToken}` },
      body: JSON.stringify({ content: "x".repeat(60), kind: "challenge" }),
    });
    expect(challenge.status).toBe(200);
  });

  it("blocks responses when the author closed the idea", async () => {
    const authorToken = await register("author_f");
    const id = await publishIdea(authorToken, { openToResponse: false });
    const otherToken = await register("other_f");
    const res = await SELF.fetch(`http://localhost/api/ideas/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${otherToken}` },
      body: JSON.stringify({ content: "x".repeat(40), kind: "reply" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("debate from a challenge", () => {
  it("author accepts a pending challenge and a debate starts", async () => {
    const authorToken = await register("author_g");
    const id = await publishIdea(authorToken);
    const challengerToken = await register("challenger_g");

    await SELF.fetch(`http://localhost/api/ideas/${id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${challengerToken}` },
      body: JSON.stringify({ content: "z".repeat(60), kind: "challenge" }),
    });
    const response = await env.DB.prepare("SELECT id FROM idea_responses WHERE idea_id = ?").bind(id).first<{ id: number }>();

    const res = await SELF.fetch(`http://localhost/api/ideas/${id}/responses/${response!.id}/debate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authorToken}` },
    });
    expect(res.status).toBe(200);
    const { id: debateId } = await res.json<{ id: number }>();

    const debate = await env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<{ status: string; creator_username: string }>();
    expect(debate!.status).toBe("in_progress");
    expect(debate!.creator_username).toBe("author_g");

    const msgs = await env.DB.prepare("SELECT COUNT(*) AS c FROM debate_messages WHERE debate_id = ?").bind(debateId).first<{ c: number }>();
    expect(msgs!.c).toBe(2);
  });

  it("rejects raising a debate on your own idea", async () => {
    const authorToken = await register("author_h");
    const id = await publishIdea(authorToken);
    const res = await SELF.fetch(`http://localhost/api/ideas/${id}/debate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authorToken}` },
      body: JSON.stringify({ content: "q".repeat(60) }),
    });
    expect(res.status).toBe(400);
  });
});

describe("follows", () => {
  it("follows and unfollows, and the profile tracks it", async () => {
    const a = await register("follower_x");
    await register("followee_x");

    const follow = await SELF.fetch("http://localhost/api/users/followee_x/follow", {
      method: "POST",
      headers: { Authorization: `Bearer ${a}` },
    });
    expect(follow.status).toBe(200);

    const profile = await SELF.fetch("http://localhost/api/users/followee_x", {
      headers: { Authorization: `Bearer ${a}` },
    });
    const body = await profile.json<{ isFollowing: boolean; followerCount: number }>();
    expect(body.isFollowing).toBe(true);
    expect(body.followerCount).toBe(1);

    const unfollow = await SELF.fetch("http://localhost/api/users/followee_x/follow", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${a}` },
    });
    expect(unfollow.status).toBe(200);
  });
});
