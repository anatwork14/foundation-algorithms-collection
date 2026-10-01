import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THEME_STORAGE_KEY = "foundation-algorithms-theme";

async function useTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: THEME_STORAGE_KEY, value: theme },
  );
}

test("reference search finds sources through verified notice text", async ({ page }) => {
  await useTheme(page, "light");
  await page.goto("/references", { waitUntil: "domcontentloaded" });

  const search = page.getByPlaceholder("Search papers, authors, standards, algorithms, errata…");
  await search.fill("errata");

  await expect(page.getByRole("heading", { name: /FIPS 203/ })).toBeVisible();
  await expect(page.locator('[aria-label="Source notices"]').getByText("Errata", { exact: true })).toBeVisible();
});

test("reference notice filter isolates verified errata sources", async ({ page }) => {
  await useTheme(page, "light");
  await page.goto("/references", { waitUntil: "domcontentloaded" });

  await page.getByRole("combobox", { name: "Filter references by source notice" }).selectOption("Errata");

  await expect(page.locator(".reference-result-count")).toHaveText("1 reference");
  await expect(page.getByRole("heading", { name: /FIPS 203/ })).toBeVisible();
  await expect(page.locator(".reference-row")).toHaveCount(1);
});

test("FIPS 203 exposes inspectable version and errata provenance", async ({ page }) => {
  await useTheme(page, "dark");
  await page.goto("/references/nist-2024-fips203", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: /FIPS 203/ })).toBeVisible();
  await expect(page.getByText("Source notices").first()).toBeVisible();
  await expect(page.locator(".reference-source-notices").getByText("Version", { exact: true })).toBeVisible();
  await expect(page.locator(".reference-source-notices").getByText("Errata", { exact: true })).toBeVisible();
  await expect(page.getByText(/issue has been identified and will be corrected in a future update\/revision/i)).toBeVisible();

  const authoritativeLinks = page.getByRole("link", { name: /Inspect authoritative notice/i });
  await expect(authoritativeLinks).toHaveCount(2);
  await expect(authoritativeLinks.nth(1)).toHaveAttribute("href", /fips-203-potential-updates\.xlsx$/);

  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("reference notice detail remains page-contained on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await useTheme(page, "light");
  await page.goto("/references/nist-2024-fips203", { waitUntil: "domcontentloaded" });

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
  await expect(page.locator(".reference-source-notices")).toBeVisible();
});
