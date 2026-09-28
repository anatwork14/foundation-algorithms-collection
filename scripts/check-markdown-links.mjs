import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const excludedDirectories = new Set([".git", ".next", "node_modules"]);

// This is the authors' long-standing Sutton/Barto textbook URL used across the
// corpus. Keep the exception exact rather than allowing HTTP by hostname.
const legacyHttpAllowlist = new Set([
  "http://incompleteideas.net/book/the-book-2nd.html",
]);

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (excludedDirectories.has(entry)) continue;
    const path = join(directory, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (stat.isFile() && extname(path).toLowerCase() === ".md") files.push(path);
  }
  return files;
}

function normalizeTarget(rawTarget) {
  let target = rawTarget.trim();
  if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
  target = target.replace(/^['"]|['"]$/g, "");
  return target;
}

function isExternalOrNonFile(target) {
  return !target
    || target.startsWith("#")
    || target.startsWith("/")
    || target.startsWith("//")
    || /^[a-z][a-z0-9+.-]*:/i.test(target);
}

function localPathFor(sourceFile, rawTarget) {
  const target = normalizeTarget(rawTarget);
  if (isExternalOrNonFile(target)) return null;
  const withoutFragment = target.split("#", 1)[0].split("?", 1)[0];
  if (!withoutFragment) return null;
  let decoded = withoutFragment;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    // Keep the literal path; existence validation will report it if invalid.
  }
  return resolve(dirname(sourceFile), decoded);
}

function stripBareUrlPunctuation(value) {
  return value.replace(/[),.;:!?\]}>'"]+$/g, "");
}

function withoutFencedCode(content) {
  return content.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, " ");
}

function externalUrlsFrom(content, explicitTargets) {
  const urls = new Set();
  for (const rawTarget of explicitTargets) {
    const target = normalizeTarget(rawTarget);
    if (/^https?:\/\//i.test(target)) urls.add(target);
  }
  for (const match of withoutFencedCode(content).matchAll(/https?:\/\/[^\s<`]+/gi)) {
    urls.add(stripBareUrlPunctuation(match[0]));
  }
  return [...urls];
}

function externalPolicyError(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "invalid URL syntax";
  }
  if (parsed.protocol === "http:" && legacyHttpAllowlist.has(rawUrl)) return null;
  if (parsed.protocol !== "https:") return "external research links must use HTTPS unless the exact legacy URL is allowlisted";
  if (parsed.username || parsed.password) return "embedded URL credentials are not allowed";
  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".localhost")) {
    return "localhost/loopback targets are not valid research sources";
  }
  return null;
}

const markdownFiles = walk(root);
const failures = [];
let checkedLocalLinks = 0;
let checkedExternalUrls = 0;
let allowedLegacyHttpUrls = 0;

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf8");
  const targets = [];

  // Inline links/images: [label](target), ![alt](target)
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    targets.push(match[1]);
  }

  // Reference-style definitions: [name]: target
  for (const match of content.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) {
    targets.push(match[1]);
  }

  for (const target of targets) {
    const localPath = localPathFor(file, target);
    if (!localPath) continue;
    checkedLocalLinks += 1;
    if (!existsSync(localPath)) failures.push(`${relative(root, file)} -> ${target}: local target does not exist`);
  }

  for (const url of externalUrlsFrom(content, targets)) {
    checkedExternalUrls += 1;
    if (legacyHttpAllowlist.has(url)) allowedLegacyHttpUrls += 1;
    const policyError = externalPolicyError(url);
    if (policyError) failures.push(`${relative(root, file)} -> ${url}: ${policyError}`);
  }
}

if (failures.length) {
  console.error(`Markdown link-policy failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Checked ${checkedLocalLinks} local links and ${checkedExternalUrls} external URLs across ${markdownFiles.length} Markdown files without network requests (${allowedLegacyHttpUrls} legacy HTTP occurrence${allowedLegacyHttpUrls === 1 ? "" : "s"} allowlisted).`,
);
