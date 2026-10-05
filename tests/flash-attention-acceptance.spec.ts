import { expect, test } from "@playwright/test";

test("Transformer detail exposes FlashAttention method, extension, and executable snapshot", async ({ page }) => {
  await page.goto("/algorithms/transformer-attention");

  await expect(page.getByRole("heading", { name: "Transformer Attention" })).toBeVisible();
  await expect(page.getByRole("link", { name: /FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /FlashAttention-2/i })).toBeVisible();
});