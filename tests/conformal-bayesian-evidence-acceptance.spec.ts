import { expect, test } from "@playwright/test";

test("Conformal Prediction detail exposes Bayesian ridge comparison evidence", async ({ page }) => {
  await page.goto("/algorithms/conformal-prediction");

  await expect(page.getByRole("heading", { name: "Conformal Prediction" })).toBeVisible();
  await expect(page.locator('a[href="/references/burnaev-2014-conformalized-ridge-efficiency"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#conformal-vs-bayesian-ridge-efficiency"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/bayesian-inference"]').first()).toBeVisible();
});
