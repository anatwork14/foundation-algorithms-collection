import { expect, test } from "@playwright/test";

test("Flow Matching detail exposes the pinned Meta implementation and license scope", async ({ page }) => {
  await page.goto("/algorithms/flow-matching");

  await expect(page.getByRole("heading", { name: "Flow Matching" })).toBeVisible();
  await expect(page.locator('a[href="/implementations/meta-flow-matching"]')).toBeVisible();
  await expect(page.locator('a[href="/references/lipman-2023-flow-matching"]').first()).toBeVisible();
});
