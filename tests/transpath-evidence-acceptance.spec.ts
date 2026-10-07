import { expect, test } from "@playwright/test";

test("A* and Learned Heuristics expose TransPath Transformer evidence", async ({ page }) => {
  await page.goto("/algorithms/a-star");
  await expect(page.getByRole("heading", { name: "A* Search" })).toBeVisible();
  await expect(page.locator('a[href="/references/kirilenko-2023-transpath"]').first()).toBeVisible();
  await expect(page.locator('a[href="/implementations/transpath-transformer-heuristic"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/transformer-attention"]').first()).toBeVisible();

  await page.goto("/algorithms/learned-heuristics");
  await expect(page.getByRole("heading", { name: "Learned Heuristics" })).toBeVisible();
  await expect(page.locator('a[href="/references/kirilenko-2023-transpath"]').first()).toBeVisible();
  await expect(page.locator('a[href="/implementations/transpath-transformer-heuristic"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/transformer-attention"]').first()).toBeVisible();
});
