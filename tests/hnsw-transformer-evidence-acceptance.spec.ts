import { expect, test } from "@playwright/test";

test("HNSW and Transformer details expose the dense-retrieval evidence", async ({ page }) => {
  await page.goto("/algorithms/hnsw");
  await expect(page.getByRole("heading", { name: "HNSW" })).toBeVisible();
  await expect(page.locator('a[href="/references/ma-2023-anserini-hnsw"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/transformer-attention"]').first()).toBeVisible();

  await page.goto("/algorithms/transformer-attention");
  await expect(page.getByRole("heading", { name: "Transformer Attention" })).toBeVisible();
  await expect(page.locator('a[href="/references/ma-2023-anserini-hnsw"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/hnsw"]').first()).toBeVisible();
});
