import { createGitHubClient } from "./githubClient.js";

export async function crawlRepo(repo) {
  const client = createGitHubClient();

  const [owner, name] = repo.split("/");

  const response = await client.rest.repos.getContent({
    owner,
    repo: name,
    path: ""
  });

  return {
    status: "ok",
    repo,
    files: response.data.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type
    }))
  };
}
