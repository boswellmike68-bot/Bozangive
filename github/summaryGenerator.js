import { createGitHubClient } from "./githubClient.js";

export async function generateSummary(repo) {
  const client = createGitHubClient();
  const [owner, name] = repo.split("/");

  const response = await client.rest.repos.getContent({
    owner,
    repo: name,
    path: ""
  });

  const mdFiles = response.data.filter(item =>
    item.name.endsWith(".md")
  );

  const summaries = [];

  for (const file of mdFiles) {
    const contentResponse = await client.rest.repos.getContent({
      owner,
      repo: name,
      path: file.path
    });

    const decoded = Buffer.from(
      contentResponse.data.content,
      "base64"
    ).toString("utf8");

    summaries.push({
      file: file.name,
      summary: decoded.slice(0, 300) + "..."
    });
  }

  return {
    status: "ok",
    repo,
    summaries
  };
}
