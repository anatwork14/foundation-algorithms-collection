import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const THEME_STORAGE_KEY = "foundation-algorithms-theme";
const desktop = { width: 1440, height: 1000 };
const phone = { width: 390, height: 844 };

const primaryRoutes = [
  "/",
  "/archive",
  "/algorithms",
  "/algorithms/linucb",
  "/atlas",
  "/lab",
  "/evidence",
  "/references",
  "/references/graph",
  "/implementations",
  "/experiments",
  "/claims",
  "/passages",
  "/replications",
];

const representativeRoutes = [
  "/",
  "/algorithms/linucb",
  "/atlas",
  "/evidence",
];

async function openWithTheme(page: Page, route: string, theme: "light" | "dark") {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: THEME_STORAGE_KEY, value: theme },
  );
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response, `No navigation response for ${route}`).not.toBeNull();
  expect(response?.ok(), `Expected ${route} to return a successful response`).toBeTruthy();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

async function expectNoDocumentOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return {
      clientWidth: root.clientWidth,
      scrollWidth: Math.max(root.scrollWidth, body?.scrollWidth ?? 0),
    };
  });

  expect(
    dimensions.scrollWidth,
    `Document width ${dimensions.scrollWidth}px exceeds viewport ${dimensions.clientWidth}px`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test.describe("production route rendering", () => {
  for (const route of primaryRoutes) {
    test(`${route} renders without page-level horizontal overflow`, async ({ page }) => {
      await page.setViewportSize(desktop);
      await openWithTheme(page, route, "light");
      await expect(page.locator("main").first()).toBeVisible();
      await expectNoDocumentOverflow(page);
    });
  }
});

test.describe("theme and responsive matrix", () => {
  for (const route of representativeRoutes) {
    for (const theme of ["light", "dark"] as const) {
      for (const viewport of [desktop, phone]) {
        const label = viewport.width === phone.width ? "phone" : "desktop";
        test(`${route} stays contained in ${theme} ${label}`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await openWithTheme(page, route, theme);
          await expectNoDocumentOverflow(page);
        });
      }
    }
  }
});

test.describe("automated accessibility", () => {
  for (const route of representativeRoutes) {
    for (const theme of ["light", "dark"] as const) {
      test(`${route} has no WCAG A/AA axe violations in ${theme}`, async ({ page }) => {
        await page.setViewportSize(desktop);
        await openWithTheme(page, route, theme);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    }
  }
});

test("command palette is keyboard-operable and restores focus", async ({ page }) => {
  await page.setViewportSize(desktop);
  await openWithTheme(page, "/", "light");

  const trigger = page.getByRole("button", { name: "Search research" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Search the research hub" });
  const input = page.getByRole("textbox", { name: "Search research" });
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();

  await input.fill("LinUCB");
  await expect(dialog.getByText("LinUCB", { exact: true }).first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile navigation exposes state, current page, and Escape behavior", async ({ page }) => {
  await page.setViewportSize(phone);
  await openWithTheme(page, "/atlas", "dark");

  const toggle = page.locator(".mobile-menu-button");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAccessibleName("Open navigation");
  await expect(page.getByRole("link", { name: "Atlas", exact: true })).toHaveAttribute("aria-current", "page");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAccessibleName("Close navigation");
  await expect(navigation).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
});

test("long-form math and wide content stay locally contained on phone", async ({ page }) => {
  await page.setViewportSize(phone);
  await openWithTheme(page, "/algorithms/linucb", "light");

  const displayMath = page.locator(".markdown-body .katex-display");
  expect(await displayMath.count()).toBeGreaterThan(0);
  expect(await displayMath.first().evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");

  const tables = page.locator(".markdown-body .table-scroll");
  if (await tables.count()) {
    const overflow = await tables.first().evaluate((element) => getComputedStyle(element).overflowX);
    expect(["auto", "scroll"]).toContain(overflow);
  }

  await expectNoDocumentOverflow(page);
});
