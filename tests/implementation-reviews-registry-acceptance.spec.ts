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
  await expect(faissRecord.getByRole("link", { name: /Pinned faiss\/IndexHNSW\.h/i })).toBeVisible();
  await expect(faissRecord.getByRole("link", { name: /Observed faiss\/IndexHNSW\.cpp/i })).toBeVisible();
  await expect(faissRecord.getByRole("link", { name: /Permalink/i })).toHaveAttribute("href", "/implementations/reviews#faiss-hnsw-r1");
});

test("upstream review registry filters by decision, material change, and source-path search", async ({ page }) => {
  await page.goto("/implementations/reviews");

  const decision = page.getByRole("combobox", { name: "Filter upstream reviews by decision" });
  const material = page.getByRole("combobox", { name: "Filter upstream reviews by material change" });
  const search = page.getByRole("searchbox", { name: "Search upstream implementation reviews" });

  await decision.selectOption("Needs follow-up");
  await expect(page.getByText("No matching upstream review.")).toBeVisible();

  await decision.selectOption("Retain pin");
  await material.selectOption("Changed");
  await expect(page.getByText("No matching upstream review.")).toBeVisible();

  await material.selectOption("Unchanged");
  await search.fill("IndexHNSW.cpp");
  await expect(page.getByRole("article").filter({ hasText: "Faiss" })).toBeVisible();
});

test("Evidence navigation reaches the upstream review registry", async ({ page }) => {
  await page.goto("/implementations");
  await page.getByRole("link", { name: "Reviews" }).click();
  await expect(page).toHaveURL(/\/implementations\/reviews$/);
  await expect(page.getByRole("heading", { name: "Review branch movement without rewriting evidence history." })).toBeVisible();
});