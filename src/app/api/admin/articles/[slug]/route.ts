import { NextResponse } from "next/server";
import { getFile, deleteFile, buildCommitMessage } from "@/lib/github";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const path = `content/articles/${slug}.mdx`;
    const { content, sha } = await getFile(path);
    return NextResponse.json({ content, sha });
  } catch (e) {
    const message = e instanceof Error ? e.message : "File not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sha } = await request.json();
    if (!sha) {
      return NextResponse.json(
        { error: "SHA is required for deletion" },
        { status: 400 }
      );
    }

    const path = `content/articles/${slug}.mdx`;
    await deleteFile(path, await buildCommitMessage("delete", "article", slug), sha);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}