import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 900 } as const;
const phone = { width: 390, height: 844 } as const;
const representativeRoutes = [
  "/",
  "/archive",
  "/archive/08-bandits-contextual-bandits-linucb",
  "/algorithms/linucb",
  "/atlas",
  "/lab",
  "/evidence",
];

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function applyTextOnlyScale(page: Page, percent = 200) {
  await page.evaluate((scale) => {
    const style = document.createElement("style");
    style.dataset.acceptanceTextScale = String(scale);
    style.textContent = `html { font-size: ${scale}% !important; }`;
    document.head.append(style);
  }, percent);
}

for (const route of representativeRoutes) {
  test(`${route} reflows without document overflow at 200% text scaling`, async ({ page }) => {
    await page.setViewportSize(desktop);
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok(), `${route} should render successfully`).toBeTruthy();

    await applyTextOnlyScale(page);
    await expect(page.locator("main").first()).toBeVisible();
    await expectNoPageOverflow(page);
  });
}

test("phone controls keep a minimum 24px interactive target", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const undersized = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll<HTMLElement>("button, input, select, textarea")];
    return candidates
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          label: element.getAttribute("aria-label") ?? element.getAttribute("placeholder") ?? element.textContent?.trim().slice(0, 80) ?? "",
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        };
      })
      .filter((entry) => entry.width < 24 || entry.height < 24);
  });

  expect(undersized, `Interactive controls below 24px:\n${JSON.stringify(undersized, null, 2)}`).toEqual([]);
});

test("skip link bypasses repeated navigation and focuses the content boundary", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/atlas", { waitUntil: "domcontentloaded" });

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page).toHaveURL(/#main-content$/);
});

test("Evidence sub-navigation exposes one clean label per destination", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/evidence", { waitUntil: "domcontentloaded" });

  const nav = page.getByRole("navigation", { name: "Evidence sections" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Overview", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "References", exact: true })).toBeVisible();

  const exposedIcons = await nav.locator("svg:not([aria-hidden='true'])").count();
  expect(exposedIcons).toBe(0);
});

test("reduced-motion preference suppresses meaningful transition duration", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const durations = await page.evaluate(() => {
    const selectors = [".main-nav a", ".domain-card", ".archive-row", ".theme-toggle"];
    return selectors.flatMap((selector) =>
      [...document.querySelectorAll<HTMLElement>(selector)].slice(0, 2).map((element) => ({
        selector,
        transitionDuration: getComputedStyle(element).transitionDuration,
        animationDuration: getComputedStyle(element).animationDuration,
      })),
    );
  });

  for (const entry of durations) {
    const transitionSeconds = entry.transitionDuration.split(",").map((value) => value.trim()).map((value) => value.endsWith("ms") ? Number.parseFloat(value) / 1000 : Number.parseFloat(value));
    const animationSeconds = entry.animationDuration.split(",").map((value) => value.trim()).map((value) => value.endsWith("ms") ? Number.parseFloat(value) / 1000 : Number.parseFloat(value));
    expect(Math.max(...transitionSeconds, 0), `${entry.selector} transition should be effectively disabled`).toBeLessThanOrEqual(0.01);
    expect(Math.max(...animationSeconds, 0), `${entry.selector} animation should be effectively disabled`).toBeLessThanOrEqual(0.01);
  }
});
