import assert from "node:assert/strict";
import test from "node:test";

import { THEME_STORAGE_KEY, themeBootScript } from "../lib/theme.ts";

test("theme bootstrap is safe to import and persists one stable preference key", () => {
  assert.equal(THEME_STORAGE_KEY, "foundation-algorithms-theme");
  assert.match(themeBootScript, new RegExp(THEME_STORAGE_KEY));
});

test("theme bootstrap resolves both explicit modes and applies them before hydration", () => {
  assert.match(themeBootScript, /stored === "light" \|\| stored === "dark"/);
  assert.match(themeBootScript, /prefers-color-scheme: dark/);
  assert.match(themeBootScript, /document\.documentElement\.dataset\.theme = theme/);
  assert.match(themeBootScript, /document\.documentElement\.style\.colorScheme = theme/);
});
