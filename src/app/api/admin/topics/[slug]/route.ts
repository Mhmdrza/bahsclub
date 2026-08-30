import { NextResponse } from "next/server";
import { getFile, deleteFile, buildCommitMessage } from "@/lib/github";
import { isAuthenticated } from "@/lib/auth";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const path = `content/topics/${slug}.md`;
    const { content, sha } = await getFile(path);
    return NextResponse.json({ content, sha });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { sha } = await request.json();
    if (!sha) return NextResponse.json({ error: "SHA required" }, { status: 400 });
    await deleteFile(`content/topics/${slug}.md`, await buildCommitMessage("delete", "topic", slug), sha);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Delete failed" }, { status: 500 });
  }
}