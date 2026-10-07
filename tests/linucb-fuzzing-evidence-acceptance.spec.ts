import { expect, test } from "@playwright/test";

test("Coverage-guided fuzzing detail exposes contextual LinUCB mutation evidence", async ({ page }) => {
  await page.goto("/algorithms/coverage-guided-fuzzing");

  await expect(page.getByRole("heading", { name: "Coverage-Guided Fuzzing" })).toBeVisible();
  await expect(page.locator('a[href="/references/wang-2021-cmfuzz"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#linucb-context-aware-fuzz-mutation"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/linucb"]').first()).toBeVisible();
});
