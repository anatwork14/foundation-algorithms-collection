import { expect, test } from "@playwright/test";

test("SAT/SMT detail exposes CirC proof-compilation evidence", async ({ page }) => {
  await page.goto("/algorithms/sat-smt-solving");

  await expect(page.getByRole("heading", { name: "SAT / SMT Solving" })).toBeVisible();
  await expect(page.locator('a[href="/references/ozdemir-2022-circ"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims#circ-shared-smt-r1cs-constraint-compilation"]')).toBeVisible();
  await expect(page.locator('a[href="/implementations/circ-compiler"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/zero-knowledge-proofs"]').first()).toBeVisible();
});
