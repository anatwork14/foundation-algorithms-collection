import { expect, test } from "@playwright/test";

test("Reference details expose the Atlas edges they support", async ({ page }) => {
  const response = await page.goto("/references/li-2010-contextual-bandit-news", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const meta = page.locator(".reference-detail-meta");
  const supportedEdges = meta.locator("div").filter({ hasText: "Atlas edges supported" });
  await expect(supportedEdges).toBeVisible();
  expect(Number.parseInt((await supportedEdges.locator("strong").innerText()).trim(), 10)).toBeGreaterThan(0);

  const relationCard = page.locator(".relation-evidence-card");
  await expect(relationCard).toBeVisible();
  await expect(relationCard).toContainText("LinUCB → UCB1");
  await expect(relationCard).toContainText("derived from");
  await expect(relationCard.getByRole("link", { name: /LinUCB → UCB1/i })).toHaveAttribute("href", "/algorithms/linucb");
});

test("Atlas makes source-backed and conceptual relation edges distinguishable", async ({ page }) => {
  const response = await page.goto("/atlas", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const evidenceFilter = page.getByLabel("Filter Atlas by relation evidence");
  const coverage = page.locator(".atlas-edge-coverage");
  const relationTable = page.locator(".atlas-relation-table");

  await expect(evidenceFilter).toBeVisible();
  await expect(coverage).toContainText("source-backed");
  await expect(coverage).toContainText("conceptual");

  await evidenceFilter.selectOption("Source-backed");
  await expect(coverage).toContainText("0 conceptual");
  expect(await relationTable.locator(".atlas-relation-kind small.is-source-backed").count()).toBeGreaterThan(0);
  await expect(relationTable.locator(".atlas-relation-kind small.is-conceptual")).toHaveCount(0);

  await evidenceFilter.selectOption("Conceptual");
  await expect(coverage).toContainText("0 source-backed");
  expect(await relationTable.locator(".atlas-relation-kind small.is-conceptual").count()).toBeGreaterThan(0);
  await expect(relationTable.locator(".atlas-relation-kind small.is-source-backed")).toHaveCount(0);
});

test("Atlas URLs restore focused node and structural filters", async ({ page }) => {
  const response = await page.goto("/atlas?algorithm=hnsw&relation=used-by&evidence=source-backed", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const hnsw = page.getByRole("button", { name: /HNSW/i }).first();
  const linucb = page.getByRole("button", { name: /LinUCB/i }).first();
  const relationFilter = page.getByLabel("Filter Atlas by relationship type");
  const evidenceFilter = page.getByLabel("Filter Atlas by relation evidence");

  await expect(hnsw).toHaveAttribute("aria-pressed", "true");
  await expect(relationFilter).toHaveValue("used-by");
  await expect(evidenceFilter).toHaveValue("Source-backed");

  await evidenceFilter.selectOption("Conceptual");
  await expect(page).toHaveURL(/evidence=conceptual/);

  await linucb.click();
  await expect(linucb).toHaveAttribute("aria-pressed", "true");
  await expect(page).not.toHaveURL(/algorithm=hnsw/);

  await page.goBack();
  await expect(hnsw).toHaveAttribute("aria-pressed", "true");
  await expect(evidenceFilter).toHaveValue("Conceptual");
  await expect(relationFilter).toHaveValue("used-by");
});
