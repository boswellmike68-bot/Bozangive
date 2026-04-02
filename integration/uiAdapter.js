function parseGitHubRepoIdFromUrl(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)/i);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

export function adaptUiPayloadToTask(uiPayload, options = {}) {
  const policy = {
    usePageContent: false,
    ignoreEmbeddedInstructions: true,
    ...(uiPayload?.policy ?? {})
  };
  policy.usePageContent = false;

  const repoFromPayload = uiPayload?.targetRepo?.id;
  const repoFromUrl = parseGitHubRepoIdFromUrl(uiPayload?.context?.activeTab?.pageUrl);
  const repo = repoFromPayload ?? repoFromUrl ?? options?.defaultRepo ?? null;

  const timestamp = uiPayload?.timestamp ?? options?.timestamp ?? null;
  if (!timestamp) {
    return {
      status: "error",
      reason: "Missing timestamp; deterministic runs require an explicit timestamp.",
      policy
    };
  }

  if (policy.usePageContent !== false) {
    return {
      status: "blocked",
      reason: "policy.usePageContent must be false",
      policy
    };
  }

  return {
    status: "ok",
    task: {
      action: "inventory",
      type: "read",
      taskId: uiPayload?.taskId ?? options?.taskId ?? "task-local",
      source: uiPayload?.source ?? options?.source ?? "uiAdapter",
      timestamp,
      intent: uiPayload?.intent ?? "inventory-request",
      repo,
      repoRoot: options?.repoRoot,
      context: {
        activeTab: uiPayload?.context?.activeTab ?? null,
        backgroundTabsCount: uiPayload?.context?.backgroundTabsCount ?? null
      },
      policy
    }
  };
}
