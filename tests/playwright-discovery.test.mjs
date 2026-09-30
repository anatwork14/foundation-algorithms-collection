import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = fs.readFileSync(new URL("../playwright.config.ts", import.meta.url), "utf8");

test("Playwright discovers every acceptance spec instead of maintaining a manual allowlist", () => {
  assert.match(config, /testDir:\s*["']\.\/tests["']/);
  assert.match(config, /testMatch:\s*["']\*\*\/\*\.spec\.ts["']/);

  const explicitSpecArray = /testMatch:\s*\[/m.test(config);
  assert.equal(explicitSpecArray, false, "Do not replace glob discovery with a manual acceptance-spec allowlist");
});
