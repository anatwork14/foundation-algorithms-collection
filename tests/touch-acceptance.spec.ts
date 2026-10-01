import { expect, test } from "@playwright/test";

const phone = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  colorScheme: "light" as const,
};

test("coarse-pointer phone can navigate, switch theme, and search without hover", async ({ browser }) => {
  const context = await browser.newContext(phone);
  const page = await context.newPage();

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const pointer = await page.evaluate(() => ({
    maxTouchPoints: navigator.maxTouchPoints,
    coarse: matchMedia("(pointer: coarse)").matches,
    hover: matchMedia("(hover: hover)").matches,
  }));
  expect(pointer.maxTouchPoints).toBeGreaterThan(0);
  expect(pointer.coarse).toBeTruthy();
  expect(pointer.hover).toBeFalsy();

  const menu = page.locator('button[aria-controls="primary-navigation"]');
  await expect(menu).toHaveAccessibleName("Open navigation");
  await menu.tap();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toHaveAccessibleName("Close navigation");

  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primary).toBeVisible();
  await primary.getByRole("link", { name: "Evidence" }).tap();
  await expect(page).toHaveURL(/\/evidence$/);
  await expect(primary.getByRole("link", { name: "Evidence" })).toHaveAttribute("aria-current", "page");

  const dark = page.getByRole("button", { name: "Switch to dark mode" });
  await dark.tap();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("foundation-algorithms-theme"))).toBe("dark");

  await page.getByRole("button", { name: "Search research" }).tap();
  const dialog = page.getByRole("dialog", { name: "Search the research hub" });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("textbox", { name: "Search research" });
  await input.fill("LinUCB");

  const result = dialog.locator(".palette-result").filter({ hasText: "LinUCB" }).first();
  await expect(result).toBeVisible();
  await result.tap();
  await expect(page).toHaveURL(/\/algorithms\/linucb$/);

  await context.close();
});

test("editorial research rows expose direct touch navigation", async ({ browser }) => {
  const context = await browser.newContext(phone);
  const page = await context.newPage();

  await page.goto("/evidence", { waitUntil: "domcontentloaded" });
  const references = page.locator('a.evidence-hub-card[href="/references"]');
  await expect(references).toBeVisible();
  await references.tap();
  await expect(page).toHaveURL(/\/references$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const foundations = page.locator('a.domain-card[href="/archive?field=Foundations"]');
  await expect(foundations).toBeVisible();
  await foundations.tap();
  await expect(page).toHaveURL(/\/archive\?field=Foundations$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const firstCombination = page.locator("a.inspiration-card").first();
  await expect(firstCombination).toBeVisible();
  const href = await firstCombination.getAttribute("href");
  expect(href).toBeTruthy();
  await firstCombination.tap();
  await expect(page).toHaveURL(new RegExp(`${href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));

  await context.close();
});
