import { expect, test } from "@playwright/test";

test("AdamW detail exposes Swin Transformer evidence for the Transformer relation", async ({ page }) => {
  await page.goto("/algorithms/adamw");

  await expect(page.getByRole("heading", { name: "AdamW" })).toBeVisible();
  await expect(page.locator('a[href="/references/liu-2021-swin-transformer"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/transformer-attention"]').first()).toBeVisible();
});
