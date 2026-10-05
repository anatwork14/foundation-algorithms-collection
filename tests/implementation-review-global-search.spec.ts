import { expect, test } from "@playwright/test";

test("global search discovers upstream implementation reviews", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search research" }).click();

  const search = page.getByRole("textbox", { name: "Search research" });
  await search.fill("IndexHNSW.cpp");

  const result = page.getByRole("button").filter({ hasText: "Faiss HNSW upstream review" });
  await expect(result).toContainText("Implementation upstream review");
  await expect(result).toContainText("Retain pin");
  await result.click();

  await expect(page).toHaveURL(/\/implementations\/reviews#faiss-hnsw-r1$/);
  await expect(page.locator("#faiss-hnsw-r1")).toBeVisible();
});