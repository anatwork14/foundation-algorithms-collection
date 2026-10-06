import { expect, test } from "@playwright/test";

test("Mixture of Experts detail exposes the pinned SwitchTransformers implementation", async ({ page }) => {
  await page.goto("/algorithms/mixture-of-experts");

  await expect(page.getByRole("heading", { name: "Mixture of Experts" })).toBeVisible();
  await expect(page.locator('a[href="/implementations/hf-switch-transformers"]')).toBeVisible();
  await expect(page.locator('a[href="/references/fedus-2022-switch-transformer"]').first()).toBeVisible();
});
