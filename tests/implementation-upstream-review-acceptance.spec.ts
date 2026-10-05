import { expect, test } from "@playwright/test";

test("implementation registry exposes upstream review filtering", async ({ page }) => {
  await page.goto("/implementations");

  const reviewFilter = page.getByRole("combobox", { name: "Filter implementations by upstream review" });
  await expect(reviewFilter).toBeVisible();
  await reviewFilter.selectOption("Reviewed");

  await expect(page.getByRole("heading", { name: /Faiss HNSW/i })).toBeVisible();
  await expect(page.getByText(/Upstream review 2026-10-05 · Retain pin/i)).toBeVisible();
});

test("Faiss detail exposes append-only upstream review evidence", async ({ page }) => {
  await page.goto("/implementations/faiss-hnsw");

  await expect(page.getByRole("heading", { name: "Upstream review ledger" })).toBeVisible();
  await expect(page.getByText("Retain pin", { exact: false })).toBeVisible();
  await expect(page.getByText(/No material change observed in the inspected implementation paths/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Compare pinned → observed/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Pinned faiss\/IndexHNSW\.h/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Observed faiss\/IndexHNSW\.cpp/i })).toBeVisible();
});