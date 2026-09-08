import { apiFetch } from "@/lib/api-client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await apiFetch<{ messageCount: number; closed: boolean; closureRequestedBy: number | null }>(
      `/api/debates/poll/${id}`
    );
    return Response.json(data);
  } catch {
    return Response.json({ messageCount: 0, closed: false }, { status: 500 });
  }
}