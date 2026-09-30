import { expect, test } from "@playwright/test";

test("Reference details expose the Atlas edges they support", async ({ page }) => {
  const response = await page.goto("/references/li-2010-contextual-bandit-news", { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBeTruthy();

  const meta = page.locator(".reference-detail-meta");
  const supportedEdges = meta.locator("div").filter({ hasText: "Atlas edges supported" });
  await expect(supportedEdges).toBeVisible();
  expect(Number.parseInt((await supportedEdges.locator("strong").innerText()).trim(), 10)).toBeGreaterThan(0);

  const relationCard = page.locator(".relation-evidence-card");
  await expect(relationCard).toBeVisible();
  await expect(relationCard).toContainText("LinUCB → UCB1");
  await expect(relationCard).toContainText("derived from");
  await expect(relationCard.getByRole("link", { name: /LinUCB → UCB1/i })).toHaveAttribute("href", "/algorithms/linucb");
});
