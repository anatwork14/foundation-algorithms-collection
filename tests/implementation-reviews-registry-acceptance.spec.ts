import { expect, test } from "@playwright/test";

test("upstream review registry summarizes append-only decisions", async ({ page }) => {
  await page.goto("/implementations/reviews");

  await expect(page.getByRole("heading", { name: "Review branch movement without rewriting evidence history." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reviews" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("1", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("retain-pin decisions", { exact: true })).toBeVisible();

  const faissRecord = page.getByRole("article").filter({ hasText: "Faiss" });
  await expect(faissRecord).toContainText("Retain pin");
  await expect(faissRecord).toContainText("No material path change");
  await expect(faissRecord).toContainText("faiss/IndexHNSW.h · unchanged");
  await expect(faissRecord.getByRole("link", { name: /Compare commits/i })).toBeVisible();
});

test("Evidence navigation reaches the upstream review registry", async ({ page }) => {
  await page.goto("/implementations");
  await page.getByRole("link", { name: "Reviews" }).click();
  await expect(page).toHaveURL(/\/implementations\/reviews$/);
  await expect(page.getByRole("heading", { name: "Review branch movement without rewriting evidence history." })).toBeVisible();
});