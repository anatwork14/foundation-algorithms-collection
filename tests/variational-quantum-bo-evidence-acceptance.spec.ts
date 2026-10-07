import { expect, test } from "@playwright/test";

test("QAOA detail exposes Bayesian-optimization evidence", async ({ page }) => {
  await page.goto("/algorithms/qaoa");

  await expect(page.getByRole("heading", { name: "Quantum Approximate Optimization Algorithm" })).toBeVisible();
  await expect(page.locator('a[href="/references/tibaldi-2023-bo-qaoa"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#bayesian-optimization-variational-quantum-outer-loop"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/bayesian-optimization"]').first()).toBeVisible();
});
