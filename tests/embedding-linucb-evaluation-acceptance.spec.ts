import { expect, test } from "@playwright/test";

test("LinUCB exposes the independent embedding evaluation and replication record", async ({ page }) => {
  await page.goto("/replications");
  const record = page.locator("#canim-2026-embedding-linucb-evaluation");
  await expect(record).toContainText("Inconclusive");
  await expect(record.getByRole("link", { name: /Independent evaluation of retrieval-trained embeddings for LinUCB/i })).toHaveAttribute(
    "href",
    "/replications/canim-2026-embedding-linucb-evaluation",
  );
  await expect(record.getByRole("link", { name: /Independent source/i })).toHaveAttribute(
    "href",
    "/references/canim-2026-embedding-linucb-evaluation",
  );

  await page.goto("/algorithms/linucb");
  await expect(page.locator('a[href="/replications#canim-2026-embedding-linucb-evaluation"]').first()).toBeVisible();
  await expect(page.locator('a[href="/references/canim-2026-embedding-linucb-evaluation"]').first()).toBeVisible();

  await page.goto("/algorithms/embedding-models");
  await expect(page.locator('a[href="/algorithms/linucb"]').first()).toBeVisible();
  await expect(page.locator('a[href="/references/canim-2026-embedding-linucb-evaluation"]').first()).toBeVisible();
});
