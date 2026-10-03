import { apiFetch } from "@/lib/api-client";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ code?: string; next?: string }> }) {
  const { code, next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/club";

  const { requireInvite } = await apiFetch<{ requireInvite: boolean }>("/api/auth/config").catch(() => ({ requireInvite: true }));

  const inviterUsername = code
    ? await apiFetch<{ inviterUsername: string }>(`/api/invites/info?code=${encodeURIComponent(code)}`)
        .then((d) => d.inviterUsername)
        .catch(() => null)
    : null;

  return <RegisterForm requireInvite={requireInvite} inviteCode={code ?? null} inviterUsername={inviterUsername} next={safeNext} />;
}
