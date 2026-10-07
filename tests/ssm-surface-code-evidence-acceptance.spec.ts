import { expect, test } from "@playwright/test";

test("State-space detail exposes Sparse Mamba surface-code decoding evidence", async ({ page }) => {
  await page.goto("/algorithms/state-space-models");

  await expect(page.getByRole("heading", { name: /State-Space Models/i })).toBeVisible();
  await expect(page.locator('a[href="/references/sayedsalehi-2026-sparse-mamba-qec"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#mamba-surface-code-defect-sequence-decoding"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/surface-code-decoding"]').first()).toBeVisible();
});
