import { expect, test } from "@playwright/test";

test("QFT detail exposes canonical phase-estimation evidence and the QPE relation", async ({ page }) => {
  await page.goto("/algorithms/quantum-fourier-transform");

  await expect(page.getByRole("heading", { name: "Quantum Fourier Transform" })).toBeVisible();
  await expect(page.locator('a[href="/references/cleve-1998-quantum-algorithms-revisited"]').first()).toBeVisible();
  await expect(page.locator('a[href="/claims/qft-based-phase-estimation-readout"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/quantum-phase-estimation"]').first()).toBeVisible();
});
