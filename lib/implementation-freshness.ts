export type ImplementationFreshnessState = "Current" | "Upstream moved" | "Unavailable";

export type GitHubRepositoryCoordinates = {
  owner: string;
  repo: string;
};

export function parseGitHubRepository(repository: string): GitHubRepositoryCoordinates | null {
  let url: URL;
  try {
    url = new URL(repository);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return null;

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!owner || !repo) return null;
  return { owner, repo };
}

export function implementationFreshnessState(
  verifiedCommit: string,
  upstreamCommit: string | null,
): ImplementationFreshnessState {
  if (!upstreamCommit) return "Unavailable";
  return verifiedCommit.toLowerCase() === upstreamCommit.toLowerCase() ? "Current" : "Upstream moved";
}
