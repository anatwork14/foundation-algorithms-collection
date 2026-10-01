import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THEME_STORAGE_KEY = "foundation-algorithms-theme";
const cases = [
  { name: "desktop light", width: 1440, height: 1000, theme: "light" as const },
  { name: "desktop dark", width: 1440, height: 1000, theme: "dark" as const },
  { name: "phone light", width: 390, height: 844, theme: "light" as const },
  { name: "phone dark", width: 390, height: 844, theme: "dark" as const },
];

for (const item of cases) {
  test(`Evidence Gaps remains contained in ${item.name}`, async ({ page }) => {
    await page.setViewportSize({ width: item.width, height: item.height });
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: THEME_STORAGE_KEY, value: item.theme },
    );
    const response = await page.goto("/evidence/gaps", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("html")).toHaveAttribute("data-theme", item.theme);
    await expect(page.getByRole("heading", { level: 1, name: "See what the archive does not yet record." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Gaps/ })).toHaveAttribute("aria-current", "page");

    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }));
    expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  });
}

test("Evidence Gaps exposes editorial coverage rows without WCAG A/AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/evidence/gaps", { waitUntil: "domcontentloaded" });

  expect(await page.locator(".evidence-gap-row").count()).toBeGreaterThan(0);
  await expect(page.getByText("Missing layers, not quality scores.")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
