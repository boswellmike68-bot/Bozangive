import { createGitHubClient } from "./githubClient.js";

export async function generateSummary(repo, options = {}) {
  const usePageContent = options?.policy?.usePageContent;
  if (usePageContent !== false) {
    return {
      status: "blocked",
      reason: "policy.usePageContent must be false"
    };
  }

  const client = createGitHubClient();
  const [owner, name] = repo.split("/");

  const response = await client.rest.repos.getContent({
    owner,
    repo: name,
    path: ""
  });

  const mdFiles = response.data
    .filter(item => item.name.endsWith(".md"))
    .map(item => ({
      file: item.name,
      path: item.path,
      type: item.type
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  return {
    status: "ok",
    repo,
    summaries: mdFiles
  };
}
