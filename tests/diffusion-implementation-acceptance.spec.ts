import { expect, test } from "@playwright/test";

test("Diffusion detail exposes the commit-pinned Diffusers DDPM implementation", async ({ page }) => {
  await page.goto("/algorithms/diffusion-models");

  await expect(page.getByRole("heading", { name: "Diffusion Models" })).toBeVisible();
  await expect(page.locator('a[href="/implementations/diffusers-ddpm"]')).toBeVisible();
  await expect(page.getByRole("link", { name: /Denoising Diffusion Probabilistic Models/i })).toBeVisible();
});
