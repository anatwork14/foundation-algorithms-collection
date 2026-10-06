import { expect, test } from "@playwright/test";

test("GNN detail exposes detector-graph surface-code decoding evidence", async ({ page }) => {
  await page.goto("/algorithms/graph-neural-networks");

  await expect(page.getByRole("heading", { name: "Graph Neural Networks" })).toBeVisible();
  await expect(page.locator('a[href="/references/lange-2025-gnn-qec-decoder"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#gnn-surface-code-detector-graph-decoding"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/surface-code-decoding"]').first()).toBeVisible();
});
