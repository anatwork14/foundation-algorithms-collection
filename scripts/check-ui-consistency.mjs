import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const layoutPath = path.join(root, "app", "layout.tsx");
const uiPath = path.join(root, "app", "research-ui.css");
const refinementsPath = path.join(root, "app", "research-refinements.css");
const themeDockPath = path.join(root, "app", "theme-dock.css");
const themeTogglePath = path.join(root, "components", "theme-toggle.tsx");
const siteHeaderPath = path.join(root, "components", "site-header.tsx");
const atlasExplorerPath = path.join(root, "components", "atlas-explorer.tsx");
const auditPath = path.join(root, "UI_AUDIT.md");

const layout = fs.readFileSync(layoutPath, "utf8");
const ui = fs.readFileSync(uiPath, "utf8");
const refinements = fs.readFileSync(refinementsPath, "utf8");
const themeDock = fs.readFileSync(themeDockPath, "utf8");
const themeToggle = fs.readFileSync(themeTogglePath, "utf8");
const siteHeader = fs.readFileSync(siteHeaderPath, "utf8");
const atlasExplorer = fs.readFileSync(atlasExplorerPath, "utf8");
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

function cssBlock(pattern, label) {
  const match = ui.match(pattern);
  if (!match) {
    errors.push(`Unable to read ${label} theme block from research-ui.css`);
    return "";
  }
  return match[1];
}

function hexVar(block, name, label) {
  const match = block.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) {
    errors.push(`Unable to read --${name} from ${label} theme block`);
    return null;
  }
  return match[1];
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function requireAaTextContrast(foreground, backgrounds, label) {
  if (!foreground || backgrounds.some((background) => !background)) return;
  const minimum = Math.min(...backgrounds.map((background) => contrastRatio(foreground, background)));
  if (minimum < 4.5) {
    errors.push(`${label} contrast is ${minimum.toFixed(2)}:1; small metadata text requires at least 4.5:1`);
  }
}

const lightTheme = cssBlock(/:root\s*\{([\s\S]*?)\n\}/, "light");
const darkTheme = cssBlock(/html\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/, "dark");
const lightMuted2 = hexVar(lightTheme, "muted-2", "light");
const lightBg = hexVar(lightTheme, "bg", "light");
const lightSurfaceStrong = hexVar(lightTheme, "surface-strong", "light");
const darkMuted2 = hexVar(darkTheme, "muted-2", "dark");
const darkBg = hexVar(darkTheme, "bg", "dark");
const darkSurfaceStrong = hexVar(darkTheme, "surface-strong", "dark");
requireAaTextContrast(lightMuted2, [lightBg, lightSurfaceStrong], "Light --muted-2");
requireAaTextContrast(darkMuted2, [darkBg, darkSurfaceStrong], "Dark --muted-2");

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

if (/className="theme-toggle-dock"[^>]*aria-(?:label|labelledby)/.test(layout)) {
  errors.push("The nonvisual theme-toggle mount must not expose ARIA naming without a semantic role");
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

const renderedContrastContracts = [
  ["inspiration-card foreground", ".inspiration-card { color: var(--ink) !important; }"],
  ["inspiration-card muted copy", ".inspiration-card > p,"],
  ["neutral Atlas motif", ".atlas-orbit .atlas-node {"],
  ["neutral Atlas motif background", "background: var(--surface-strong) !important;"],
  ["neutral Atlas motif text", "color: var(--ink) !important;"],
];

for (const [label, needle] of renderedContrastContracts) {
  if (!ui.includes(needle)) errors.push(`Rendered contrast contract missing ${label}: ${needle}`);
}

const headerAccessibilityContracts = [
  ["mobile navigation target", 'id="primary-navigation"'],
  ["mobile navigation expanded state", "aria-expanded={menuOpen}"],
  ["mobile navigation ownership", 'aria-controls="primary-navigation"'],
  ["active navigation current-page state", 'aria-current={active ? "page" : undefined}'],
  ["search dialog popup semantics", 'aria-haspopup="dialog"'],
];

for (const [label, needle] of headerAccessibilityContracts) {
  if (!siteHeader.includes(needle)) errors.push(`Header accessibility contract missing ${label}: ${needle}`);
}

const atlasAccessibilityContracts = [
  ["explicit Atlas search name", 'aria-label="Search algorithms in Atlas"'],
  ["Atlas selected-entity state", "aria-pressed={algorithm.id === selected.id}"],
  ["Atlas relationship landmark", 'role="region"'],
  ["Atlas relationship details label", 'aria-label={`Relationship details for ${selected.name}`}'],
];

for (const [label, needle] of atlasAccessibilityContracts) {
  if (!atlasExplorer.includes(needle)) errors.push(`Atlas accessibility contract missing ${label}: ${needle}`);
}

if (!refinements.includes(".markdown-body .katex-display") || !refinements.includes("overflow-x: auto")) {
  errors.push("Long display equations must remain horizontally scrollable inside the reading surface");
}

const tabletFieldIndexContracts = [
  ["tablet-only field-index breakpoint", "@media (min-width: 761px) and (max-width: 980px)"],
  ["single-column tablet field index", ".domain-section .domain-grid"],
  ["field rows cannot span legacy tablet columns", "grid-column: auto !important"],
  ["field row text column may shrink", "minmax(0, 1.4fr)"],
];

for (const [label, needle] of tabletFieldIndexContracts) {
  if (!refinements.includes(needle)) errors.push(`Tablet research-index contract missing ${label}: ${needle}`);
}

if (errors.length) {
  console.error("UI consistency check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`UI consistency check passed (${cssImports.length} active app CSS layers; one canonical visual layer).`);
