import { expect, test } from "@playwright/test";

const cases = [
  {
    path: "/algorithms/dynamic-programming",
    heading: "Dynamic Programming",
    claimHref: "/claims#dynamic-programming-state-reuse",
    referenceHref: "/references/bellman-1952-dynamic-programming",
  },
  {
    path: "/algorithms/bayesian-inference",
    heading: "Bayesian Inference",
    claimHref: "/claims#bayesian-inference-prior-evidence-posterior",
    referenceHref: "/references/gelman-2013-bayesian-data-analysis",
  },
  {
    path: "/algorithms/embedding-models",
    heading: "Embedding Models",
    claimHref: "/claims#embedding-models-continuous-vector-representations",
    referenceHref: "/references/mikolov-2013-word-representations",
  },
];

for (const item of cases) {
  test(`${item.heading} exposes its new foundational Claim and Reference`, async ({ page }) => {
    await page.goto(item.path);

    await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    await expect(page.locator(`a[href="${item.claimHref}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${item.referenceHref}"]`).first()).toBeVisible();
  });
}
