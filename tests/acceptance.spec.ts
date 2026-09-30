import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const THEME_STORAGE_KEY = "foundation-algorithms-theme";
const desktop = { name: "desktop", width: 1440, height: 1000 } as const;
const tablet = { name: "tablet", width: 820, height: 1180 } as const;
const phone = { name: "phone", width: 390, height: 844 } as const;
const narrow = { name: "narrow", width: 320, height: 900 } as const;
const responsiveViewports = [desktop, tablet, phone, narrow];

const primaryRoutes = [
  "/",
  "/archive",
  "/archive/08-bandits-contextual-bandits-linucb",
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
  "/archive/08-bandits-contextual-bandits-linucb",
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
    const viewportWidth = root.clientWidth;
    const scrollWidth = Math.max(root.scrollWidth, body?.scrollWidth ?? 0);
    const offenders = [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: typeof element.className === "string" ? element.className : "",
          text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          position: style.position,
          overflowX: style.overflowX,
          overshoot: Math.max(0, Math.round(rect.right - viewportWidth), Math.round(-rect.left)),
        };
      })
      .filter((entry) => entry.overshoot > 1)
      .sort((a, b) => b.overshoot - a.overshoot)
      .slice(0, 12);

    return { clientWidth: viewportWidth, scrollWidth, offenders };
  });

  expect(
    dimensions.scrollWidth,
    `Document width ${dimensions.scrollWidth}px exceeds viewport ${dimensions.clientWidth}px.\n` +
      `Overflow offenders:\n${JSON.stringify(dimensions.offenders, null, 2)}`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

test.describe("production route rendering", () => {
  for (const route of primaryRoutes) {
    test(`${route} renders without page-level horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: desktop.width, height: desktop.height });
      await openWithTheme(page, route, "light");
      await expect(page.locator("main").first()).toBeVisible();
      await expectNoDocumentOverflow(page);
    });
  }
});

test.describe("theme and responsive matrix", () => {
  for (const route of representativeRoutes) {
    for (const theme of ["light", "dark"] as const) {
      for (const viewport of responsiveViewports) {
        test(`${route} stays contained in ${theme} ${viewport.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
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
        await page.setViewportSize({ width: desktop.width, height: desktop.height });
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
  await page.setViewportSize({ width: desktop.width, height: desktop.height });
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

test("theme toggle persists the explicit choice across navigation", async ({ page }) => {
  await page.setViewportSize({ width: desktop.width, height: desktop.height });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.setItem(key, "light"), THEME_STORAGE_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY)).toBe("dark");

  await page.goto("/archive", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
});

test("mobile navigation exposes state, current page, and Escape behavior", async ({ page }) => {
  await page.setViewportSize({ width: phone.width, height: phone.height });
  await openWithTheme(page, "/atlas", "dark");

  const toggle = page.locator(".mobile-menu-button");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAccessibleName("Open navigation");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAccessibleName("Close navigation");
  await expect(navigation).toBeVisible();
  await expect(page.getByRole("link", { name: "Atlas", exact: true })).toHaveAttribute("aria-current", "page");

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
});

test("long-form math and wide content stay locally contained and keyboard reachable on phone", async ({ page }) => {
  await page.setViewportSize({ width: phone.width, height: phone.height });
  await openWithTheme(page, "/archive/08-bandits-contextual-bandits-linucb", "light");

  const displayMath = page.locator(".markdown-body .katex-display");
  expect(await displayMath.count()).toBeGreaterThan(0);
  expect(await displayMath.first().evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");

  const tables = page.locator(".markdown-body .table-scroll");
  if (await tables.count()) {
    const overflow = await tables.first().evaluate((element) => getComputedStyle(element).overflowX);
    expect(["auto", "scroll"]).toContain(overflow);
  }

  const inaccessibleScrollers = await page.evaluate(() => {
    const selector = [
      ".markdown-body .katex-display",
      ".markdown-body :not(.katex-display) > .katex",
      ".markdown-body pre",
      ".markdown-body .table-scroll",
    ].join(",");

    return [...document.querySelectorAll<HTMLElement>(selector)]
      .filter((element) => element.scrollWidth > element.clientWidth + 1 && element.tabIndex < 0)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
  });

  expect(inaccessibleScrollers).toEqual([]);
  await expectNoDocumentOverflow(page);
});
