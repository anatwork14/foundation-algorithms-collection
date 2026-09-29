import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const layoutPath = path.join(root, "app", "layout.tsx");
const uiPath = path.join(root, "app", "research-ui.css");
const themeDockPath = path.join(root, "app", "theme-dock.css");
const themeTogglePath = path.join(root, "components", "theme-toggle.tsx");
const auditPath = path.join(root, "UI_AUDIT.md");

const layout = fs.readFileSync(layoutPath, "utf8");
const ui = fs.readFileSync(uiPath, "utf8");
const themeDock = fs.readFileSync(themeDockPath, "utf8");
const themeToggle = fs.readFileSync(themeTogglePath, "utf8");
const audit = fs.readFileSync(auditPath, "utf8");

const deprecatedVisualLayers = [
  "liquid-glass.css",
  "liquid-glass-research.css",
  "minimal-research.css",
  "agocode-typography.css",
  "research-index.css",
  "interface-consistency.css",
];

const errors = [];

for (const file of deprecatedVisualLayers) {
  if (fs.existsSync(path.join(root, "app", file))) {
    errors.push(`Deprecated visual layer still exists: app/${file}`);
  }
  if (layout.includes(file)) {
    errors.push(`Deprecated visual layer is still imported by app/layout.tsx: ${file}`);
  }
}

const cssImports = [...layout.matchAll(/import\s+["']\.\/([^"']+\.css)["'];/g)].map((match) => match[1]);
if (!cssImports.includes("research-ui.css")) {
  errors.push("app/layout.tsx must import research-ui.css");
} else if (cssImports.at(-1) !== "research-ui.css") {
  errors.push(`research-ui.css must be the final app CSS import; found ${cssImports.at(-1)} after it`);
}

const requiredUiContracts = [
  ["Fraunces/editorial role", "--font-editorial"],
  ["reading/UI role", "--font-reading"],
  ["technical mono role", "--font-mono"],
  ["explicit dark theme", 'html[data-theme="dark"]'],
  ["shared control height", "--control-h"],
  ["shared shell width", "--shell-width"],
  ["desktop/tablet breakpoint", "@media (max-width: 980px)"],
  ["mobile breakpoint", "@media (max-width: 760px)"],
];

for (const [label, needle] of requiredUiContracts) {
  if (!ui.includes(needle)) errors.push(`Canonical UI contract missing ${label}: ${needle}`);
}

if (/--glass-|backdrop-filter:\s*blur\(2[0-9]px\)/.test(themeDock)) {
  errors.push("Theme control must use canonical neutral tokens, not the retired glass system");
}

if (!themeToggle.includes('import { createPortal } from "react-dom";')) {
  errors.push("Theme control must portal its interactive button into the header action group");
}

if (!themeToggle.includes('querySelector<HTMLElement>(".header-actions")')) {
  errors.push("Theme control portal must target .header-actions");
}

if (!layout.includes('className="theme-toggle-dock"') || !layout.includes('style={{ display: "contents" }}')) {
  errors.push("Theme toggle layout mount must remain nonvisual with display: contents");
}

if (audit.includes("should ultimately be placed inside the header action group") || audit.includes("should be moved into `.header-actions`")) {
  errors.push("UI_AUDIT.md still describes the resolved floating theme-control issue as unfinished");
}

if (ui.includes(".evidence-hub-page")) {
  errors.push("Canonical page rhythm uses the wrong Evidence root class; target .evidence-hub instead of .evidence-hub-page");
}

if (!/\.lab-page,\s*\n\.evidence-hub,\s*\n\.reference-page,/.test(ui)) {
  errors.push("Canonical desktop/mobile page-rhythm groups must include the real .evidence-hub root");
}

if (errors.length) {
  console.error("UI consistency check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`UI consistency check passed (${cssImports.length} active app CSS layers; one canonical visual layer).`);
