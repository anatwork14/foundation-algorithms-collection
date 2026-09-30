import { expect, test } from "@playwright/test";

test("completed reranking pilot exposes result, limitations, and reproducible artifacts", async ({ page }) => {
  const response = await page.goto("/experiments/hnsw-linucb-reranking-drift-pilot", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole("heading", { name: "Controlled LinUCB reranking adaptation under preference drift" })).toBeVisible();
  await expect(page.getByText("Completed", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mixed outcome" })).toBeVisible();

  await expect(page.getByText("0.547783 ± 0.019274 SD", { exact: true })).toBeVisible();
  await expect(page.getByText("+0.030350", { exact: true })).toBeVisible();
  await expect(page.getByText("0.109826 ± 0.017492 SD", { exact: true })).toBeVisible();

  await expect(page.getByText(/does not execute or benchmark an HNSW index/i)).toBeVisible();
  await expect(page.getByText(/confirmatory success thresholds were not preregistered/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "How this record should be interpreted" })).toBeVisible();

  const harness = page.getByRole("link", { name: /Deterministic simulation harness/i });
  const result = page.getByRole("link", { name: /Recorded aggregate result/i });
  await expect(harness).toHaveAttribute("href", /experiments\/hnsw-linucb-reranking-simulation\.mjs$/);
  await expect(result).toHaveAttribute("href", /experiments\/results\/hnsw-linucb-reranking-drift-pilot\.json$/);
});
