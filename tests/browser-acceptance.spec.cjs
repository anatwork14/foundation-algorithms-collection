const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const artifactDir = path.join(process.cwd(), "artifacts", "ui-acceptance");
fs.mkdirSync(artifactDir, { recursive: true });

const representativeRoutes = [
  "/",
  "/archive",
  "/algorithms",
  "/atlas",
  "/lab",
  "/evidence",
  "/references",
  "/implementations",
  "/experiments",
  "/claims",
  "/passages",
];

async function open(page, route) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  expect(response, `Expected ${route} to respond`).not.toBeNull();
  expect(response.status(), `Expected ${route} to return a successful HTTP status`).toBeLessThan(400);
}

async function expectNoPageOverflow(page, route) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(
    Math.max(dimensions.html, dimensions.body),
    `${route} should not create page-level horizontal scrolling`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectBasicAccessibility(page, route) {
  const issues = await page.evaluate(() => {
    const failures = [];
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const namedBy = (element) => {
      const id = element.getAttribute("aria-labelledby");
      if (!id) return false;
      return id
        .split(/\s+/)
        .map((value) => document.getElementById(value))
        .some((node) => node?.textContent?.trim());
    };
    const hasName = (element) =>
      Boolean(
        element.getAttribute("aria-label")?.trim() ||
        namedBy(element) ||
        element.getAttribute("title")?.trim() ||
        element.textContent?.trim(),
      );

    if (!document.querySelector("main")) failures.push("missing <main> landmark");
    const h1s = [...document.querySelectorAll("h1")].filter(visible);
    if (h1s.length !== 1) failures.push(`expected exactly one visible h1, found ${h1s.length}`);

    for (const button of document.querySelectorAll("button")) {
      if (visible(button) && !hasName(button)) failures.push("visible button without accessible name");
    }

    for (const input of document.querySelectorAll("input, select, textarea")) {
      if (!visible(input)) continue;
      const hasExplicitName = Boolean(
        input.getAttribute("aria-label")?.trim() ||
        namedBy(input) ||
        input.labels?.length,
      );
      if (!hasExplicitName) {
        const identifier = input.getAttribute("name") || input.getAttribute("placeholder") || input.tagName.toLowerCase();
        failures.push(`form control without explicit accessible name: ${identifier}`);
      }
    }

    for (const image of document.querySelectorAll("img")) {
      if (visible(image) && !image.hasAttribute("alt")) failures.push("visible image without alt attribute");
    }

    const ids = new Map();
    for (const node of document.querySelectorAll("[id]")) {
      const id = node.id;
      ids.set(id, (ids.get(id) || 0) + 1);
    }
    for (const [id, count] of ids) {
      if (count > 1) failures.push(`duplicate id #${id} (${count} occurrences)`);
    }

    return failures;
  });

  expect(issues, `${route} should satisfy the browser acceptance accessibility guard`).toEqual([]);
}

test.describe("Foundation Algorithms browser acceptance", () => {
  test("desktop routes keep one consistent, overflow-safe research shell", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    for (const route of representativeRoutes) {
      await open(page, route);
      await expectNoPageOverflow(page, route);
      await expectBasicAccessibility(page, route);
    }
  });

  test("typography roles and explicit light/dark themes render consistently", async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await context.addInitScript(() => localStorage.setItem("foundation-algorithms-theme", "light"));
    await open(page, "/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const fonts = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      h1: getComputedStyle(document.querySelector("h1")).fontFamily,
      technical: getComputedStyle(document.querySelector(".eyebrow") || document.querySelector("code")).fontFamily,
    }));

    expect(fonts.body).toMatch(/Source[_ ]Sans[_ ]3/i);
    expect(fonts.h1).toMatch(/Fraunces/i);
    expect(fonts.technical).toMatch(/JetBrains[_ ]Mono/i);

    await page.screenshot({ path: path.join(artifactDir, "home-desktop-light.png"), fullPage: true });

    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("foundation-algorithms-theme"))).toBe("dark");

    await page.screenshot({ path: path.join(artifactDir, "home-desktop-dark.png"), fullPage: true });
  });

  test("command search is keyboard-operable and keeps focus inside the modal", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page, "/");

    await page.keyboard.press("Control+K");
    const dialog = page.getByRole("dialog", { name: "Search the research hub" });
    await expect(dialog).toBeVisible();

    const search = dialog.getByRole("textbox", { name: "Search research" });
    await expect(search).toBeFocused();
    await search.fill("LinUCB");
    await expect(dialog.getByText("LinUCB", { exact: false }).first()).toBeVisible();

    for (let index = 0; index < 14; index += 1) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Search research" })).toBeFocused();
  });

  test("mobile navigation, theme control, and core routes remain usable without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, "/");
    await expectNoPageOverflow(page, "/ mobile");

    const menu = page.getByRole("button", { name: "Open navigation" });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");

    await page.screenshot({ path: path.join(artifactDir, "home-mobile.png"), fullPage: true });

    for (const route of ["/archive", "/algorithms", "/atlas", "/lab", "/evidence"]) {
      await open(page, route);
      await expectNoPageOverflow(page, `${route} mobile`);
    }
  });

  test("long-form research contains wide math, tables, and code locally", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, "/archive/08-bandits-contextual-bandits-linucb");
    await expectNoPageOverflow(page, "LinUCB chapter mobile");

    const containment = await page.evaluate(() => {
      const viewport = window.innerWidth;
      const selectors = [".katex-display", ".table-scroll", ".markdown-body pre"];
      return selectors.flatMap((selector) =>
        [...document.querySelectorAll(selector)].map((element) => ({
          selector,
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
          viewport,
        })),
      );
    });

    expect(containment.length, "Expected the research chapter to exercise at least one wide-content surface").toBeGreaterThan(0);
    for (const item of containment) {
      expect(item.left, `${item.selector} should not escape the left viewport edge`).toBeGreaterThanOrEqual(-1);
      expect(item.right, `${item.selector} should not escape the right viewport edge`).toBeLessThanOrEqual(item.viewport + 1);
    }

    await page.screenshot({ path: path.join(artifactDir, "linucb-mobile-reading.png"), fullPage: true });
  });
});
