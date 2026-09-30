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

test("Evidence exposes Atlas provenance as coverage rather than a score", async ({ page }) => {
  const response = await page.goto("/evidence", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const section = page.getByRole("region", { name: "Atlas relation provenance coverage" });
  await expect(section).toBeVisible();
  await expect(section).toContainText("typed Atlas edges");
  await expect(section).toContainText("source-backed edges");
  await expect(section).toContainText("conceptual edges");
  await expect(page.getByText(/not confidence, quality, or truth scores/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Inspect source-backed Atlas edges/i })).toHaveAttribute("href", "/atlas?evidence=source-backed");

  const metrics = await section.locator("div").evaluateAll((rows) => rows.map((row) => {
    const value = Number.parseInt(row.querySelector("strong")?.textContent ?? "0", 10);
    const label = row.querySelector("span")?.textContent?.trim() ?? "";
    return { value, label };
  }));
  const total = metrics.find((metric) => metric.label === "typed Atlas edges")?.value ?? 0;
  const sourced = metrics.find((metric) => metric.label === "source-backed edges")?.value ?? 0;
  const conceptual = metrics.find((metric) => metric.label === "conceptual edges")?.value ?? 0;
  expect(total).toBeGreaterThan(0);
  expect(sourced).toBeGreaterThan(0);
  expect(sourced + conceptual).toBe(total);
});

test("first independent replication record is inspectable end to end", async ({ page }) => {
  const response = await page.goto("/replications/aumuller-2020-hnsw-evaluation", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole("heading", { name: "Independent ANN-Benchmarks evaluation of HNSW" })).toBeVisible();
  await expect(page.getByText("Partially supports", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why this counts as independent evaluation" })).toBeVisible();
  await expect(page.getByText(/different author group from HNSW authors/i)).toBeVisible();

  await expect(page.getByRole("link", { name: /Inspect curated source record/i })).toHaveAttribute(
    "href",
    "/references/aumuller-2020-ann-benchmarks",
  );
  await expect(page.getByRole("link", { name: /Efficient and Robust Approximate Nearest Neighbor Search/i })).toHaveAttribute(
    "href",
    "/references/malkov-2018-hnsw",
  );
  await expect(page.getByRole("link", { name: /HNSW/i }).first()).toHaveAttribute("href", "/algorithms/hnsw");
});
