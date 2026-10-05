import { expect, test } from "@playwright/test";

test("GNN detail exposes claims, primary sources, executable GCN and GraphSAGE, and independent evaluation", async ({ page }) => {
  await page.goto("/algorithms/graph-neural-networks");

  await expect(page.getByRole("heading", { name: "Graph Neural Networks" })).toBeVisible();
  await expect(page.getByText("Curated claims").locator("..").getByText("2", { exact: true })).toBeVisible();
  await expect(page.getByText("References").locator("..").getByText("3", { exact: true })).toBeVisible();
  await expect(page.getByText("Implementations").locator("..").getByText("2", { exact: true })).toBeVisible();
  await expect(page.getByText("Independent replications").locator("..").getByText("1", { exact: true })).toBeVisible();

  await expect(page.getByRole("link", { name: /Graph convolutional networks update node representations/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /GraphSAGE learns neighborhood aggregation functions/i })).toBeVisible();

  await expect(page.getByRole("link", { name: /Semi-Supervised Classification with Graph Convolutional Networks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inductive Representation Learning on Large Graphs/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Benchmarking Graph Neural Networks/i })).toBeVisible();

  await expect(page.getByRole("link", { name: /PyTorch Geometric GCN/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /PyTorch Geometric GraphSAGE/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Independent benchmark evaluation of GCN and GraphSAGE/i })).toBeVisible();
});
