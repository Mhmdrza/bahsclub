"use server";

interface GitHubFile {
  path: string;
  content: string; // decoded
  sha: string;
}

interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
}

interface CommitResult {
  sha: string;
  commit: { message: string };
}

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub config: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO must be set"
    );
  }

  return { token, owner, repo, branch };
}

function apiUrl(path: string): string {
  return `https://api.github.com/repos/${getConfig().owner}/${getConfig().repo}/${path}`;
}

function headers(): Record<string, string> {
  const { token } = getConfig();
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "bahsclub-admin",
  };
}

/**
 * Fetch a file from GitHub repository.
 * Returns the decoded content and the file's SHA (needed for updates).
 */
export async function getFile(path: string): Promise<GitHubFile> {
  const branch = getConfig().branch;
  const url = apiUrl(`contents/${path}?ref=${branch}`);

  const res = await fetch(url, { headers: headers() });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`File not found: ${path}`);
    }
    const body = await res.text();
    throw new Error(`GitHub API error fetching ${path}: ${res.status} ${body}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");

  return { path: data.path, content, sha: data.sha };
}

/**
 * Create or update a file in the GitHub repository.
 * If sha is provided, it updates an existing file.
 */
export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<CommitResult> {
  const { branch } = getConfig();
  const url = apiUrl(`contents/${path}`);

  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const responseBody = await res.text();
    throw new Error(
      `GitHub API error writing ${path}: ${res.status} ${responseBody}`
    );
  }

  return res.json();
}

/**
 * Delete a file from the GitHub repository.
 */
export async function deleteFile(
  path: string,
  message: string,
  sha: string
): Promise<void> {
  const { branch } = getConfig();
  const url = apiUrl(`contents/${path}`);

  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({
      message,
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `GitHub API error deleting ${path}: ${res.status} ${body}`
    );
  }
}

/**
 * List all files in the content directory (recursive).
 */
export async function listContentFiles(): Promise<GitHubTreeItem[]> {
  const { branch, owner, repo } = getConfig();
  // Get the latest commit for the branch to find the tree SHA
  const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
  const refRes = await fetch(refUrl, { headers: headers() });

  if (!refRes.ok) {
    throw new Error(`GitHub API error getting ref: ${refRes.status}`);
  }

  const refData = await refRes.json();
  const commitSha = refData.object.sha;

  // Get the commit to find the tree
  const commitUrl = `https://api.github.com/repos/${owner}/${repo}/git/commits/${commitSha}`;
  const commitRes = await fetch(commitUrl, { headers: headers() });

  if (!commitRes.ok) {
    throw new Error(`GitHub API error getting commit: ${commitRes.status}`);
  }

  const commitData = await commitRes.json();
  const treeSha = commitData.tree.sha;

  // Get the full tree recursively
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`;
  const treeRes = await fetch(treeUrl, { headers: headers() });

  if (!treeRes.ok) {
    throw new Error(`GitHub API error getting tree: ${treeRes.status}`);
  }

  const treeData = await treeRes.json();

  return (treeData.tree as GitHubTreeItem[]).filter(
    (item: GitHubTreeItem) =>
      item.type === "blob" && item.path.startsWith("content/")
  );
}

/**
 * Get recent commits for the content directory.
 */
export async function getRecentCommits(count = 10) {
  const { owner, repo, branch } = getConfig();
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&path=content&per_page=${count}`;

  const res = await fetch(url, { headers: headers() });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

/**
 * Build a commit message for admin actions.
 */
export async function buildCommitMessage(
  action: "create" | "update" | "delete",
  contentType: string,
  slug: string
): Promise<string> {
  const actionMap = {
    create: "ایجاد",
    update: "ویرایش",
    delete: "حذف",
  } as const;
  return `[admin] ${actionMap[action]} ${contentType}: ${slug}`;
}