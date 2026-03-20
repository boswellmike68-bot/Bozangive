import { Octokit } from "octokit";
import fs from "fs";

export function createGitHubClient() {
  const token = process.env.BOZANGIVE_TOKEN;

  if (!token) {
    throw new Error("Missing BOZANGIVE_TOKEN environment variable.");
  }

  return new Octokit({
    auth: token,
    request: {
      fetch: (...args) => fetch(...args)
    }
  });
}
