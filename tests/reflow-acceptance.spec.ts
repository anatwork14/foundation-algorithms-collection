import { expect, test } from "@playwright/test";

const desktop = { width: 1280, height: 900 } as const;
const phone = { width: 390, height: 844 } as const;

const reflowRoutes = [
  "/",
  "/archive",
  "/archive/08-bandits-contextual-bandits-linucb",
  "/algorithms/linucb",
  "/atlas",
  "/lab",
  "/evidence",
];

async function documentWidths(page: import("@playwright/test").Page) {
  return page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));
}

async function applyTextScaling(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      html { font-size: 200% !important; }
      * { text-size-adjust: 100% !important; -webkit-text-size-adjust: 100% !important; }
    `,
  });
}

for (const route of reflowRoutes) {
  test(`${route} reflows without document overflow at 200% text scaling`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await applyTextScaling(page);
    const widths = await documentWidths(page);
    expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  });
}

test("phone controls keep a minimum 24px interactive target", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const controls = page.locator("a:visible, button:visible, input:visible, select:visible");
  const boxes = await controls.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      label: (element.getAttribute("aria-label") ?? element.textContent ?? element.tagName).trim().slice(0, 80),
      width: rect.width,
      height: rect.height,
    };
  }));

  for (const box of boxes) {
    expect(box.width, `${box.label} should be at least 24px wide`).toBeGreaterThanOrEqual(24);
    expect(box.height, `${box.label} should be at least 24px high`).toBeGreaterThanOrEqual(24);
  }
});

test("skip link bypasses repeated navigation and focuses the content boundary", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

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
  await expect(nav.getByRole("link", { name: "Gaps", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "References", exact: true })).toBeVisible();

  const exposedIcons = await nav.locator("svg:not([aria-hidden='true'])").count();
  expect(exposedIcons).toBe(0);
});

test("Evidence destinations stay an editorial index rather than a dashboard-card grid", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/evidence", { waitUntil: "domcontentloaded" });

  const grid = page.locator(".evidence-hub-grid");
  const rows = grid.locator(":scope > .evidence-hub-card");
  await expect(rows).toHaveCount(7);

  const layout = await rows.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      radius: Number.parseFloat(style.borderRadius) || 0,
      background: style.backgroundColor,
    };
  }));

  expect(new Set(layout.map((row) => row.x)).size).toBe(1);
  expect(Math.max(...layout.map((row) => row.width)) - Math.min(...layout.map((row) => row.width))).toBeLessThanOrEqual(1);
  expect(layout.every((row, index) => index === 0 || row.y > layout[index - 1].y)).toBeTruthy();
  expect(layout.every((row) => row.radius === 0)).toBeTruthy();
  expect(layout.every((row) => row.background === "rgba(0, 0, 0, 0)")).toBeTruthy();
});

test("Evidence flow renders seven real steps without a phantom grid cell", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/evidence", { waitUntil: "domcontentloaded" });

  const flow = page.locator(".evidence-flow-grid");
  await expect(flow.locator(":scope > div")).toHaveCount(7);
  const background = await flow.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBe("rgba(0, 0, 0, 0)");
});

test("homepage Combination Lab preview keeps a uniform two-column rhythm on desktop", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const rows = page.locator(".inspiration-grid > .inspiration-card");
  expect(await rows.count()).toBeGreaterThanOrEqual(4);
  const layout = await rows.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width) };
  }));

  const columns = [...new Set(layout.map((item) => item.x))].sort((a, b) => a - b);
  expect(columns.length).toBe(2);
  const widths = layout.map((item) => item.width);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
});

test("reduced-motion preference suppresses meaningful transition duration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize(desktop);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const transition = await page.getByRole("button", { name: "Search research" }).evaluate((element) => {
    const style = getComputedStyle(element);
    return style.transitionDuration;
  });
  const durations = transition.split(",").map((duration) => Number.parseFloat(duration) || 0);
  expect(Math.max(...durations)).toBeLessThanOrEqual(0.001);
});
