import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 900 } as const;
const phone = { width: 320, height: 900 } as const;

const semanticRoutes = [
  "/",
  "/archive/08-bandits-contextual-bandits-linucb",
  "/algorithms/linucb",
  "/atlas",
  "/lab",
  "/evidence",
  "/references/graph",
  "/experiments/hnsw-linucb-reranking-drift-pilot",
];

async function open(page: Page, route: string) {
  await page.setViewportSize(desktop);
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.ok(), `${route} should render successfully`).toBeTruthy();
}

for (const route of semanticRoutes) {
  test(`${route} exposes a coherent landmark and heading entry point`, async ({ page }) => {
    await open(page, route);

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const unnamedRegions = await page.locator('[role="region"]').evaluateAll((regions) =>
      regions
        .filter((region) => !region.getAttribute("aria-label") && !region.getAttribute("aria-labelledby"))
        .map((region) => ({
          tag: region.tagName.toLowerCase(),
          id: region.id,
          className: typeof (region as HTMLElement).className === "string" ? (region as HTMLElement).className : "",
          text: (region.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100),
        })),
    );

    expect(unnamedRegions, `Explicit regions on ${route} must have accessible names`).toEqual([]);

    const positiveTabIndex = await page.locator('[tabindex]').evaluateAll((elements) =>
      elements
        .filter((element) => Number.parseInt(element.getAttribute("tabindex") ?? "0", 10) > 0)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          id: element.id,
          tabIndex: element.getAttribute("tabindex"),
        })),
    );

    expect(positiveTabIndex, `${route} must not impose a positive tabindex order`).toEqual([]);
  });
}

test("skip navigation moves keyboard focus to the shared content target", async ({ page }) => {
  await open(page, "/atlas");

  const skip = page.getByRole("link", { name: "Skip to main content" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("command-palette result changes are announced through a polite live region", async ({ page }) => {
  await open(page, "/");

  await page.getByRole("button", { name: "Search research" }).click();
  const dialog = page.getByRole("dialog", { name: "Search the research hub" });
  await expect(dialog).toBeVisible();

  const status = dialog.locator(".palette-label");
  await expect(status).toHaveAttribute("aria-live", "polite");

  const input = dialog.getByRole("textbox", { name: "Search research" });
  await input.fill("LinUCB");
  await expect(status).toContainText(/result.*LinUCB/i);
});

test("KaTeX formulas expose MathML while visual glyph markup stays hidden from assistive technology", async ({ page }) => {
  await open(page, "/archive/08-bandits-contextual-bandits-linucb");

  const formulas = page.locator(".markdown-body .katex");
  const count = await formulas.count();
  expect(count).toBeGreaterThan(0);

  const malformed = await formulas.evaluateAll((nodes) =>
    nodes.slice(0, 40).flatMap((node, index) => {
      const math = node.querySelector(".katex-mathml math");
      const annotation = node.querySelector('.katex-mathml annotation[encoding="application/x-tex"]');
      const visual = node.querySelector(".katex-html");
      const problems: string[] = [];

      if (!math) problems.push("missing MathML");
      if (!annotation || !(annotation.textContent ?? "").trim()) problems.push("missing TeX annotation");
      if (!visual || visual.getAttribute("aria-hidden") !== "true") problems.push("visual HTML is not aria-hidden");

      return problems.length ? [{ index, problems }] : [];
    }),
  );

  expect(malformed).toEqual([]);
});

test("overflowing technical content gets a visible keyboard focus indicator", async ({ page }) => {
  await page.setViewportSize(phone);
  const response = await page.goto("/archive/08-bandits-contextual-bandits-linucb", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const managed = page.locator('.markdown-body [data-scroll-accessibility="managed"]');
  await expect.poll(async () => managed.count()).toBeGreaterThan(0);

  const target = managed.first();
  await target.focus();
  await expect(target).toBeFocused();

  const focusStyle = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
      outlineColor: style.outlineColor,
    };
  });

  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.outlineColor).not.toBe("transparent");
});

test("complex research workspaces expose stable named regions for assistive navigation", async ({ page }) => {
  await open(page, "/atlas");
  await expect(page.getByRole("region", { name: "Relationships around LinUCB" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Evidence neighbors for LinUCB" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Curated relationship evidence for LinUCB" })).toBeVisible();

  await open(page, "/lab");
  await expect(page.getByRole("region", { name: "Algorithm combination builder" })).toBeVisible();
  await expect(page.getByRole("region", { name: /Rule-based assumption analysis/i })).toBeVisible();
});
