import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1280, height: 900 } as const;

async function open(page: Page, route: string) {
  await page.setViewportSize(desktop);
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.ok(), `${route} should render successfully`).toBeTruthy();
  await expect(page.getByRole("main").first()).toBeVisible();
}

test("Atlas picker uses roving focus and arrow-key selection", async ({ page }) => {
  await open(page, "/atlas");

  const picker = page.getByRole("group", { name: "Atlas algorithms" });
  const buttons = picker.getByRole("button");
  expect(await buttons.count()).toBeGreaterThan(2);

  const selected = picker.getByRole("button", { pressed: true });
  await expect(selected).toHaveCount(1);
  await expect(selected).toHaveAttribute("tabindex", "0");
  await selected.focus();
  await expect(selected).toBeFocused();

  const initialName = (await selected.locator("strong").innerText()).trim();
  await page.keyboard.press("ArrowDown");

  const afterDown = picker.getByRole("button", { pressed: true });
  await expect(afterDown).toBeFocused();
  await expect(afterDown).toHaveAttribute("tabindex", "0");
  expect((await afterDown.locator("strong").innerText()).trim()).not.toBe(initialName);

  await page.keyboard.press("End");
  await expect(buttons.last()).toBeFocused();
  await expect(buttons.last()).toHaveAttribute("aria-pressed", "true");

  await page.keyboard.press("Home");
  await expect(buttons.first()).toBeFocused();
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
});

test("Atlas exposes reference and implementation nodes around the focused algorithm", async ({ page }) => {
  await open(page, "/atlas");

  const linucbEvidence = page.getByRole("region", { name: "Evidence neighbors for LinUCB" });
  await expect(linucbEvidence).toBeVisible();
  await expect(linucbEvidence.getByRole("link", { name: /Contextual-Bandit Approach to Personalized News/i })).toBeVisible();

  const picker = page.getByRole("group", { name: "Atlas algorithms" });
  await picker.getByRole("button", { name: /HNSW/i }).click();

  const hnswEvidence = page.getByRole("region", { name: "Evidence neighbors for HNSW" });
  await expect(hnswEvidence).toBeVisible();
  await expect(hnswEvidence.getByRole("link", { name: /Efficient and Robust Approximate Nearest Neighbor Search/i })).toBeVisible();
  await expect(hnswEvidence.getByRole("link", { name: /Faiss HNSW/i })).toBeVisible();
  await expect(hnswEvidence.locator("a", { hasText: "hnswlib" })).toBeVisible();
});

test("Atlas exposes curated source provenance separately from structural relationships", async ({ page }) => {
  await open(page, "/atlas");

  const provenance = page.getByRole("region", { name: "Curated relationship evidence for LinUCB" });
  await expect(provenance).toBeVisible();
  await expect(provenance).toContainText("source-backed visible edge");

  const ucb1Relation = provenance.locator(".relation-evidence-card").filter({ hasText: "LinUCB → UCB1" });
  await expect(ucb1Relation).toHaveCount(1);
  await expect(ucb1Relation.getByRole("link", { name: /Contextual-Bandit Approach to Personalized News/i })).toBeVisible();
  await expect(ucb1Relation).toContainText("Verified 2026-09-30");
});

test("Algorithm cards expose relation-level provenance counts and sources", async ({ page }) => {
  await open(page, "/algorithms/linucb");

  const summary = page.locator(".algorithm-summary-panel");
  const sourceBackedRow = summary.locator("div").filter({ hasText: "Source-backed relations" });
  await expect(sourceBackedRow).toBeVisible();
  expect(Number.parseInt((await sourceBackedRow.locator("strong").innerText()).trim(), 10)).toBeGreaterThan(0);

  const relationEvidence = page.locator(".relation-evidence-card").filter({ hasText: "LinUCB → UCB1" });
  await expect(relationEvidence).toHaveCount(1);
  await expect(relationEvidence.getByRole("link", { name: /2010 · A Contextual-Bandit Approach/i })).toBeVisible();
});

test("Lab pair explorer has logical keyboard order, assumption signals, and live announcements", async ({ page }) => {
  await open(page, "/lab");

  const builder = page.getByRole("region", { name: "Algorithm combination builder" });
  const left = builder.getByLabel("Algorithm A");
  const right = builder.getByLabel("Algorithm B");
  const announcement = builder.locator(".visually-hidden[aria-live='polite']");
  const assumptionAnalysis = builder.getByRole("region", { name: /Rule-based assumption analysis/i });

  await expect(assumptionAnalysis).toBeVisible();
  await expect(assumptionAnalysis).toContainText("Transparent rule-based signals");
  await expect(assumptionAnalysis).toContainText("not proof of compatibility or incompatibility");

  await left.focus();
  await expect(left).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(right).toBeFocused();

  const leftValue = await left.inputValue();
  await right.selectOption(leftValue);
  await expect(announcement).toContainText("selected twice");

  const alternate = await right.locator("option").evaluateAll((options, excluded) => {
    const candidate = options.find((option) => (option as HTMLOptionElement).value !== excluded) as HTMLOptionElement | undefined;
    return candidate?.value ?? "";
  }, leftValue);
  expect(alternate).not.toBe("");

  await right.selectOption(alternate);
  await expect(announcement).toContainText("Combination analysis updated");
  await expect(builder.getByRole("region", { name: /Rule-based assumption analysis/i })).toBeVisible();
});

test("Evidence sub-navigation is keyboard sequential and preserves current-page semantics", async ({ page }) => {
  await open(page, "/evidence");

  const nav = page.getByRole("navigation", { name: "Evidence sections" });
  const overview = nav.getByRole("link", { name: "Overview", exact: true });
  const gaps = nav.getByRole("link", { name: "Gaps", exact: true });
  const references = nav.getByRole("link", { name: "References", exact: true });

  await expect(overview).toHaveAttribute("aria-current", "page");
  await overview.focus();
  await page.keyboard.press("Tab");
  await expect(gaps).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(references).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/references$/);
  const referencesNav = page.getByRole("navigation", { name: "Evidence sections" });
  await expect(referencesNav.getByRole("link", { name: "References", exact: true })).toHaveAttribute("aria-current", "page");
});

for (const route of ["/atlas", "/lab", "/evidence"]) {
  test(`${route} keeps a visible focus indicator during keyboard traversal`, async ({ page }) => {
    await open(page, route);

    for (let step = 0; step < 8; step += 1) {
      await page.keyboard.press("Tab");
      const active = page.locator(":focus");
      await expect(active).toHaveCount(1);

      const focusStyle = await active.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
          boxShadow: style.boxShadow,
        };
      });

      const hasVisibleIndicator =
        (focusStyle.outlineStyle !== "none" && focusStyle.outlineWidth >= 1) ||
        (focusStyle.boxShadow !== "none" && focusStyle.boxShadow !== "");
      expect(hasVisibleIndicator, `Keyboard focus at step ${step + 1} on ${route} must remain visibly indicated`).toBeTruthy();
    }
  });
}
