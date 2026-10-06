import { expect, test } from "@playwright/test";

test("implementation registry exposes upstream review filtering", async ({ page }) => {
  await page.goto("/implementations");

  const reviewFilter = page.getByRole("combobox", { name: "Filter implementations by upstream review" });
  await expect(reviewFilter).toBeVisible();
  await reviewFilter.selectOption("Reviewed");

  const faissRow = page.locator(".implementation-row").filter({ hasText: "Faiss HNSW" });
  await expect(faissRow).toBeVisible();
  await expect(faissRow).toContainText("Upstream review 2026-10-06 · Retain pin");
});

test("Faiss detail exposes append-only upstream review evidence", async ({ page }) => {
  await page.goto("/implementations/faiss-hnsw");

  await expect(page.getByRole("heading", { name: "Upstream review ledger" })).toBeVisible();
  const ledger = page.getByRole("list", { name: "Implementation upstream review history" });
  const latest = ledger.getByRole("listitem").last();
  await expect(latest).toContainText("Retain pin");
  await expect(latest).toContainText("83ae8b090831");
  await expect(latest).toContainText(/No material change observed in the inspected implementation paths/i);
  await expect(latest.getByRole("link", { name: /Compare pinned → observed/i })).toBeVisible();
  await expect(latest.getByRole("link", { name: /Pinned faiss\/IndexHNSW\.h/i })).toBeVisible();
  await expect(latest.getByRole("link", { name: /Observed faiss\/IndexHNSW\.cpp/i })).toBeVisible();
});