import { describe, it, expect, beforeEach } from "vitest";
import { env, SELF } from "cloudflare:test";

const PW = "StrongPass123!";

async function register(username: string): Promise<string> {
  const res = await SELF.fetch("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email: `${username}@example.com`, password: PW }),
  });
  expect(res.status).toBe(200);
  return (await res.json<{ token: string }>()).token;
}

async function createChallenge(token: string): Promise<number> {
  const res = await SELF.fetch("http://localhost/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: "A test challenge", content: "x".repeat(60), tags: ["logic"] }),
  });
  expect(res.status).toBe(200);
  return (await res.json<{ id: number }>()).id;
}

async function acceptChallenge(token: string, challengeId: number, content = "y".repeat(60)) {
  return SELF.fetch(`http://localhost/api/challenges/${challengeId}/debate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  });
}

beforeEach(async () => {
  await env.DB.exec(
    "DELETE FROM notifications; DELETE FROM debate_messages; DELETE FROM debate_tags; DELETE FROM debates; DELETE FROM challenge_responses; DELETE FROM challenge_tags; DELETE FROM challenges; DELETE FROM tags; DELETE FROM sessions; DELETE FROM users;"
  );
});

describe("POST /api/challenges/:id/debate", () => {
  it("creates response + in_progress debate with challenge author as creator and challenger as opponent", async () => {
    const authorToken = await register("author1");
    const challengeId = await createChallenge(authorToken);
    const challengerToken = await register("challenger1");

    const res = await acceptChallenge(challengerToken, challengeId);
    expect(res.status).toBe(200);
    const { id: debateId } = await res.json<{ id: number }>();

    const debate = await env.DB.prepare("SELECT * FROM debates WHERE id = ?")
      .bind(debateId)
      .first<{ status: string; creator_username: string; opponent_id: number; counter_response_id: number }>();
    expect(debate!.status).toBe("in_progress");
    expect(debate!.creator_username).toBe("author1");
    expect(debate!.opponent_id).toBeGreaterThan(0);

    const response = await env.DB.prepare("SELECT status FROM challenge_responses WHERE id = ?")
      .bind(debate!.counter_response_id)
      .first<{ status: string }>();
    expect(response!.status).toBe("debating");

    const msgs = await env.DB.prepare("SELECT COUNT(*) AS c FROM debate_messages WHERE debate_id = ?")
      .bind(debateId)
      .first<{ c: number }>();
    expect(msgs!.c).toBe(2);
  });

  it("rejects challenging your own challenge", async () => {
    const authorToken = await register("author2");
    const challengeId = await createChallenge(authorToken);

    const res = await acceptChallenge(authorToken, challengeId);
    expect(res.status).toBe(400);
  });

  it("rejects content shorter than 50 characters", async () => {
    const authorToken = await register("author3");
    const challengeId = await createChallenge(authorToken);
    const challengerToken = await register("challenger3");

    const res = await acceptChallenge(challengerToken, challengeId, "too short");
    expect(res.status).toBe(400);
  });
});
