import { expect, test } from "@playwright/test";

test("Amplitude Estimation detail exposes primary, claim, dependency, and executable evidence", async ({ page }) => {
  await page.goto("/algorithms/amplitude-estimation");

  await expect(page.getByRole("heading", { name: "Quantum Amplitude Estimation" })).toBeVisible();
  await expect(page.locator('a[href="/claims#amplitude-estimation-amplification-phase-composition"]')).toBeVisible();
  await expect(page.locator('a[href="/references/brassard-2002-amplitude-amplification-estimation"]').first()).toBeVisible();
  await expect(page.locator('a[href="/implementations/qiskit-amplitude-estimation"]')).toBeVisible();
  await expect(page.locator('a[href="/algorithms/grover-search"]').first()).toBeVisible();
  await expect(page.locator('a[href="/algorithms/quantum-phase-estimation"]').first()).toBeVisible();
});
