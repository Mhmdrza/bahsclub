import { describe, it, expect, beforeEach } from "vitest";
import { env, SELF } from "cloudflare:test";

const PW = "StrongPass123!";

async function register(body: Record<string, unknown>) {
  return SELF.fetch("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function seedUser(username: string, email: string) {
  await env.DB.prepare(
    "INSERT INTO users (username, email, password_hash, password_salt) VALUES (?, ?, ?, ?)"
  ).bind(username, email, "h", "s").run();
  const row = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first<{ id: number }>();
  return row!.id;
}

async function seedInvite(inviterId: number, email: string, code = "inv-code-123") {
  await env.DB.prepare(
    "INSERT INTO invites (code, inviter_id, invited_email) VALUES (?, ?, ?)"
  ).bind(code, inviterId, email).run();
}

beforeEach(async () => {
  await env.DB.exec("DELETE FROM invites; DELETE FROM sessions; DELETE FROM waitlist; DELETE FROM users;");
  (env as unknown as { REQUIRE_INVITE: string }).REQUIRE_INVITE = "false";
});

describe("register when invite-only is off", () => {
  it("registers without any invite code", async () => {
    const res = await register({ username: "alice", email: "alice@example.com", password: PW });
    expect(res.status).toBe(200);
    const body = await res.json<{ token: string }>();
    expect(body.token).toBeTruthy();
  });

  it("registers when a valid invite code is supplied", async () => {
    const inviterId = await seedUser("inviter", "inviter@example.com");
    await seedInvite(inviterId, "bob@example.com", "abc123");

    const res = await register({ username: "bob", email: "bob@example.com", password: PW, inviteCode: "abc123" });
    expect(res.status).toBe(200);

    const invite = await env.DB.prepare("SELECT used_by FROM invites WHERE code = ?")
      .bind("abc123")
      .first<{ used_by: number | null }>();
    expect(invite!.used_by).not.toBeNull();
  });

  it("rejects an invalid invite code even when invites are optional", async () => {
    const res = await register({ username: "carol", email: "carol@example.com", password: PW, inviteCode: "nope" });
    expect(res.status).toBe(404);
  });

  it("rejects an already-used invite code", async () => {
    const inviterId = await seedUser("inviter", "inviter@example.com");
    await seedInvite(inviterId, "dave@example.com", "used1");
    const userId = await seedUser("dave", "dave@example.com");
    await env.DB.prepare("UPDATE invites SET used_by = ? WHERE code = ?").bind(userId, "used1").run();

    const res = await register({ username: "dave2", email: "dave@example.com", password: PW, inviteCode: "used1" });
    expect(res.status).toBe(410);
  });

  it("rejects an invite issued for a different email", async () => {
    const inviterId = await seedUser("inviter", "inviter@example.com");
    await seedInvite(inviterId, "intended@example.com", "wrongmail");

    const res = await register({ username: "eve", email: "eve@example.com", password: PW, inviteCode: "wrongmail" });
    expect(res.status).toBe(403);
  });
});

describe("register when invite-only is on", () => {
  beforeEach(() => {
    (env as unknown as { REQUIRE_INVITE: string }).REQUIRE_INVITE = "true";
  });

  it("blocks registration without an invite code", async () => {
    const res = await register({ username: "frank", email: "frank@example.com", password: PW });
    expect(res.status).toBe(403);
  });

  it("allows registration with a valid invite code", async () => {
    const inviterId = await seedUser("inviter", "inviter@example.com");
    await seedInvite(inviterId, "grace@example.com", "gcode");

    const res = await register({ username: "grace", email: "grace@example.com", password: PW, inviteCode: "gcode" });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/auth/config", () => {
  it("reports requireInvite false by default", async () => {
    const res = await SELF.fetch("http://localhost/api/auth/config");
    expect(res.status).toBe(200);
    expect(await res.json<{ requireInvite: boolean }>()).toEqual({ requireInvite: false });
  });

  it("reports requireInvite true when the flag is on", async () => {
    (env as unknown as { REQUIRE_INVITE: string }).REQUIRE_INVITE = "true";
    const res = await SELF.fetch("http://localhost/api/auth/config");
    expect(await res.json<{ requireInvite: boolean }>()).toEqual({ requireInvite: true });
  });
});