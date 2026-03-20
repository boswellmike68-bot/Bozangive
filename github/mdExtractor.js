import { createGitHubClient } from "./githubClient.js";

export async function extractMarkdown(repo) {
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

  return {
    status: "ok",
    repo,
    markdown_files: mdFiles.map(f => ({
      name: f.name,
      path: f.path
    }))
  };
}
