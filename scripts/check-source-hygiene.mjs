import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoots = ["app", "components", "lib", "scripts"];
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const excludedDirectories = new Set([".git", ".next", "node_modules"]);

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (excludedDirectories.has(entry)) continue;
    const path = join(directory, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (stat.isFile() && allowedExtensions.has(extname(path).toLowerCase())) files.push(path);
  }
  return files;
}

const files = sourceRoots.flatMap((directory) => walk(join(root, directory)));
const failures = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const display = relative(root, file);

  const banned = [
    { pattern: /\bconsole\.log\s*\(/g, label: "console.log is not allowed in committed application source" },
    { pattern: /\bdebugger\s*;/g, label: "debugger statements are not allowed" },
    { pattern: /@ts-ignore\b/g, label: "@ts-ignore is not allowed; model the type or use a justified @ts-expect-error" },
    { pattern: /@ts-nocheck\b/g, label: "@ts-nocheck is not allowed" },
  ];

  for (const rule of banned) {
    for (const match of content.matchAll(rule.pattern)) {
      const line = content.slice(0, match.index).split("\n").length;
      failures.push(`${display}:${line}: ${rule.label}`);
    }
  }

  for (const match of content.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gms)) {
    const tag = match[0];
    if (!/\brel=["'][^"']*\bnoreferrer\b[^"']*["']/.test(tag)) {
      const line = content.slice(0, match.index).split("\n").length;
      failures.push(`${display}:${line}: target=\"_blank\" anchors must include rel=\"noreferrer\"`);
    }
  }
}

if (failures.length) {
  console.error(`Source hygiene failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Checked ${files.length} source files for debug statements, TypeScript suppression, and external-anchor safety.`);
