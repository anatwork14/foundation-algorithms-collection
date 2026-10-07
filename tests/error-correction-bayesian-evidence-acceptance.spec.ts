import { expect, test } from "@playwright/test";

test("Error-Correcting Codes detail exposes Bayesian decoding evidence", async ({ page }) => {
  await page.goto("/algorithms/error-correcting-codes");

  await expect(page.getByRole("heading", { name: "Error-Correcting Codes" })).toBeVisible();
  await expect(page.locator('a[href="/references/olding-2014-bayesian-error-correction"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#error-correction-posterior-decoding"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/bayesian-inference"]').first()).toBeVisible();
});
