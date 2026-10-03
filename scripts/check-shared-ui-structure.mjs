import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const layoutPath = path.join(root, "app", "layout.tsx");
const headerPath = path.join(root, "components", "research-page-header.tsx");
const toolbarPath = path.join(root, "components", "registry-toolbar.tsx");
const toolbarCssPath = path.join(root, "app", "registry-toolbar.css");
const registryFiles = [
  "components/reference-explorer.tsx",
  "components/implementation-explorer.tsx",
  "components/experiment-explorer.tsx",
];

const errors = [];
const layout = fs.existsSync(layoutPath) ? fs.readFileSync(layoutPath, "utf8") : "";

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

if (!fs.existsSync(toolbarPath)) {
  errors.push("Missing canonical components/registry-toolbar.tsx");
} else {
  const toolbar = fs.readFileSync(toolbarPath, "utf8");
  for (const needle of [
    "ariaLabel: string",
    "searchAriaLabel: string",
    "onQueryChange: (value: string) => void",
    "<Search size={17} aria-hidden=\"true\" />",
    "aria-label={searchAriaLabel}",
    'className={`registry-toolbar ${className}`}',
    "{children}",
  ]) {
    if (!toolbar.includes(needle)) errors.push(`RegistryToolbar contract missing: ${needle}`);
  }
}

if (!fs.existsSync(toolbarCssPath)) {
  errors.push("Missing shared app/registry-toolbar.css structure");
} else {
  const toolbarCss = fs.readFileSync(toolbarCssPath, "utf8");
  for (const needle of [
    ".registry-toolbar {",
    ".registry-toolbar > label {",
    ".registry-toolbar > label:focus-within",
    ".registry-toolbar select {",
    "@media (max-width: 760px)",
  ]) {
    if (!toolbarCss.includes(needle)) errors.push(`RegistryToolbar CSS contract missing: ${needle}`);
  }
}

if (!layout.includes('import "./registry-toolbar.css";')) {
  errors.push("app/layout.tsx must import the shared registry-toolbar.css structural layer");
}
if (layout.indexOf('import "./registry-toolbar.css";') > layout.indexOf('import "./research-ui.css";')) {
  errors.push("registry-toolbar.css must load before the canonical final research-ui.css layer");
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

  if (!source.includes('import { RegistryToolbar } from "@/components/registry-toolbar";')) {
    errors.push(`${file} must import the shared RegistryToolbar`);
  }
  if (!source.includes("<RegistryToolbar")) {
    errors.push(`${file} must render the shared RegistryToolbar`);
  }
  if (/<section\s+className="(?:reference|implementation|experiment)-controls"/.test(source)) {
    errors.push(`${file} reintroduced a hand-built registry toolbar`);
  }
}

if (errors.length) {
  console.error("Shared UI structure check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Shared UI structure check passed (${registryFiles.length} registry surfaces use ResearchPageHeader + RegistryToolbar + one shared toolbar structure).`);
