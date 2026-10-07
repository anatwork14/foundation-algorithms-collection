import { expect, test } from "@playwright/test";

test("Learned Heuristics detail exposes DeepCubeA paper, claim, A* relation, and implementation", async ({ page }) => {
  await page.goto("/algorithms/learned-heuristics");

  await expect(page.getByRole("heading", { name: "Learned Heuristics" })).toBeVisible();
  await expect(page.locator('a[href="/references/agostinelli-2019-deepcubea"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#learned-cost-to-go-guides-a-star"]')).toBeVisible();
  await expect(page.locator('a[href="/implementations/deepcubea-learned-astar"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/a-star"]').first()).toBeVisible();
});
