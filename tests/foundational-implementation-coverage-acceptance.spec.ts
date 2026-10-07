import { expect, test } from "@playwright/test";

const cases = [
  {
    path: "/algorithms/embedding-models",
    heading: "Embedding Models",
    implementationHref: "/implementations/gensim-word2vec",
  },
  {
    path: "/algorithms/bayesian-inference",
    heading: "Bayesian Inference",
    implementationHref: "/implementations/pymc-posterior-sampling",
  },
];

for (const item of cases) {
  test(`${item.heading} exposes its new commit-pinned implementation`, async ({ page }) => {
    await page.goto(item.path);
    await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    await expect(page.locator(`a[href="${item.implementationHref}"]`)).toBeVisible();
  });
}
