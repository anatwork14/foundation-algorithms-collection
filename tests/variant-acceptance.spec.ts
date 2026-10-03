import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const variantRoute = "/algorithms/linucb/variants/hybrid-linucb";

async function expectNoDocumentOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
}

test("variant catalog filters by variant terminology", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/variants");

  await expect(page.getByRole("heading", { name: "Compare formulations without fragmenting the algorithm map." })).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search algorithm variants" });
  await search.fill("hybrid");

  await expect(page.getByRole("link", { name: /Hybrid LinUCB/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Disjoint LinUCB/ })).toHaveCount(0);
  await expectNoDocumentOverflow(page);
});

test("variant detail preserves parent and source provenance", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto(variantRoute);
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole("heading", { name: "Hybrid LinUCB", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "LinUCB", exact: true }).first()).toHaveAttribute("href", "/algorithms/linucb");
  await expect(page.getByRole("link", { name: /17\. Hybrid LinUCB/ })).toHaveAttribute(
    "href",
    "/archive/08-bandits-contextual-bandits-linucb#17-hybrid-linucb",
  );

  await expect(page.getByRole("link", { name: /Disjoint LinUCB/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Shared LinUCB/ })).toBeVisible();
  await expectNoDocumentOverflow(page);
});

test("variant surfaces have no WCAG A/AA axe violations", async ({ page }) => {
  for (const route of ["/variants", variantRoute]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  }
});

test("variant detail stays contained on a narrow phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(variantRoute);
  await expectNoDocumentOverflow(page);
});
