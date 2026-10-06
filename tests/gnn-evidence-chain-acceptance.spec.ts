import { expect, test } from "@playwright/test";

test("GNN detail exposes local GNNs, Graphormer, executable implementations, and independent evaluation", async ({ page }) => {
  await page.goto("/algorithms/graph-neural-networks");

  await expect(page.getByRole("heading", { name: "Graph Neural Networks" })).toBeVisible();
  await expect(page.getByText("Curated claims").locator("..").getByText("4", { exact: true })).toBeVisible();
  await expect(page.getByText("References").locator("..").getByText("5", { exact: true })).toBeVisible();
  await expect(page.getByText("Implementations").locator("..").getByText("4", { exact: true })).toBeVisible();
  await expect(page.getByText("Independent replications").locator("..").getByText("1", { exact: true })).toBeVisible();

  await expect(page.getByRole("link", { name: /Graph convolutional networks update node representations/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /GraphSAGE learns neighborhood aggregation functions/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Graph Attention Networks learn attention coefficients/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Graph Transformers can generalize attention to graph-structured inputs/i })).toBeVisible();

  await expect(page.getByRole("link", { name: /Semi-Supervised Classification with Graph Convolutional Networks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Inductive Representation Learning on Large Graphs/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Primary method · 2018\s+Graph Attention Networks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Primary method · 2021\s+Do Transformers Really Perform Badly for Graph Representation/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Benchmarking Graph Neural Networks/i })).toBeVisible();

  await expect(page.getByRole("link", { name: /PyTorch Geometric GCN/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /PyTorch Geometric GraphSAGE/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /PyTorch Geometric GAT/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Microsoft Graphormer/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Independent benchmark evaluation of GCN and GraphSAGE/i })).toBeVisible();
});
