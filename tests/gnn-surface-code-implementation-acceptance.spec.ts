import { expect, test } from "@playwright/test";

test("surface-code detail exposes the pinned GNN decoder research artifact", async ({ page }) => {
  await page.goto("/algorithms/surface-code-decoding");

  await expect(page.getByRole("heading", { name: "Surface Code Decoding" })).toBeVisible();
  await expect(page.locator('a[href="/implementations/lange-gnn-surface-code-decoder"]')).toBeVisible();
  await expect(page.locator('a[href="/references/lange-2025-gnn-qec-decoder"]').first()).toBeVisible();
});
