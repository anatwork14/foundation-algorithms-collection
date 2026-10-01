import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const headerPath = path.join(root, "components", "research-page-header.tsx");
const registryFiles = [
  "components/reference-explorer.tsx",
  "components/implementation-explorer.tsx",
  "components/experiment-explorer.tsx",
];

const errors = [];

if (!fs.existsSync(headerPath)) {
  errors.push("Missing canonical components/research-page-header.tsx");
} else {
  const header = fs.readFileSync(headerPath, "utf8");
  for (const needle of [
    'className="eyebrow"',
    "<h1>{title}</h1>",
    "<p>{description}</p>",
    "{children}",
  ]) {
    if (!header.includes(needle)) errors.push(`ResearchPageHeader contract missing: ${needle}`);
  }
}

for (const file of registryFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing registry UI file: ${file}`);
    continue;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  if (!source.includes('import { ResearchPageHeader } from "@/components/research-page-header";')) {
    errors.push(`${file} must import the shared ResearchPageHeader`);
  }
  if (!source.includes("<ResearchPageHeader")) {
    errors.push(`${file} must render the shared ResearchPageHeader`);
  }
  if (/<header\s+className="(?:reference|implementation|experiment)-hero">/.test(source)) {
    errors.push(`${file} reintroduced a hand-built registry hero`);
  }
}

if (errors.length) {
  console.error("Shared UI structure check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Shared UI structure check passed (${registryFiles.length} registry surfaces use ResearchPageHeader).`);
