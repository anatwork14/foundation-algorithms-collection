import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { implementations } from "../lib/implementations.ts";
import {
  implementationFreshnessState,
  parseGitHubRepository,
} from "../lib/implementation-freshness.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "test-results", "implementation-freshness.json");
const token = process.env.GITHUB_TOKEN?.trim();

async function resolveUpstreamCommit(record) {
  const coordinates = parseGitHubRepository(record.repository);
  if (!coordinates) {
    return {
      upstreamCommit: null,
      reason: "Repository is not a canonical public GitHub owner/repo URL",
    };
  }

  const endpoint = `https://api.github.com/repos/${encodeURIComponent(coordinates.owner)}/${encodeURIComponent(coordinates.repo)}/commits/${encodeURIComponent(record.verifiedRef)}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "foundation-algorithms-collection-freshness-report",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) {
      return {
        upstreamCommit: null,
        reason: `GitHub returned ${response.status} for ${record.verifiedRef}`,
      };
    }
    const payload = await response.json();
    if (typeof payload.sha !== "string" || !/^[0-9a-f]{40}$/i.test(payload.sha)) {
      return { upstreamCommit: null, reason: "GitHub response did not contain a full commit SHA" };
    }
    return { upstreamCommit: payload.sha.toLowerCase(), reason: null };
  } catch (error) {
    return {
      upstreamCommit: null,
      reason: error instanceof Error ? error.message : "Unknown network error",
    };
  }
}

const records = [];
for (const record of implementations) {
  const resolved = await resolveUpstreamCommit(record);
  const state = implementationFreshnessState(record.verifiedCommit, resolved.upstreamCommit);
  records.push({
    id: record.id,
    name: record.name,
    repository: record.repository,
    verifiedRef: record.verifiedRef,
    verifiedCommit: record.verifiedCommit,
    lastVerified: record.lastVerified,
    upstreamCommit: resolved.upstreamCommit,
    state,
    reason: resolved.reason,
  });
}

const counts = Object.fromEntries(
  ["Current", "Upstream moved", "Unavailable"].map((state) => [
    state,
    records.filter((record) => record.state === state).length,
  ]),
);

const report = {
  generatedAt: new Date().toISOString(),
  policy: "Informational only. Immutable verifiedCommit pins remain authoritative; an upstream move means re-review is available, not that the pinned implementation is invalid.",
  counts,
  records,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

for (const record of records) {
  const upstream = record.upstreamCommit ? record.upstreamCommit.slice(0, 12) : "unavailable";
  console.log(`${record.state.padEnd(14)} ${record.id.padEnd(28)} pinned=${record.verifiedCommit.slice(0, 12)} upstream=${upstream}`);
  if (record.reason) console.log(`  ↳ ${record.reason}`);
}
console.log(`Freshness report written to ${path.relative(root, outputPath)}: ${JSON.stringify(counts)}`);

const summaryPath = process.env.GITHUB_STEP_SUMMARY?.trim();
if (summaryPath) {
  const rows = records.map((record) => {
    const upstream = record.upstreamCommit ? `\`${record.upstreamCommit.slice(0, 12)}\`` : "—";
    return `| ${record.id} | ${record.verifiedRef} | \`${record.verifiedCommit.slice(0, 12)}\` | ${upstream} | ${record.state} |`;
  });
  const summary = [
    "## Implementation freshness",
    "",
    "> Informational only. Immutable verified commits remain the evidence snapshot; branch movement only signals that a new review is available.",
    "",
    `**${counts.Current} current · ${counts["Upstream moved"]} upstream moved · ${counts.Unavailable} unavailable**`,
    "",
    "| Implementation | Verified ref | Pinned commit | Upstream ref | State |",
    "|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.appendFileSync(summaryPath, summary);
}
