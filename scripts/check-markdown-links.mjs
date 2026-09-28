import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const excludedDirectories = new Set([".git", ".next", "node_modules"]);

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

const markdownFiles = walk(root);
const failures = [];
let checkedLinks = 0;

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
    checkedLinks += 1;
    if (!existsSync(localPath)) {
      failures.push(`${relative(root, file)} -> ${target}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken local Markdown links (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Checked ${checkedLinks} local links across ${markdownFiles.length} Markdown files.`);
