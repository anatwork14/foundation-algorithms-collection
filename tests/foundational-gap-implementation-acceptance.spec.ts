import { expect, test } from "@playwright/test";

const cases = [
  {
    path: "/algorithms/lattice-problems",
    heading: "Lattice Problems and Reduction",
    implementationHref: "/implementations/fplll-lattice-reduction",
  },
  {
    path: "/algorithms/error-correcting-codes",
    heading: "Error-Correcting Codes",
    implementationHref: "/implementations/galois-classical-codes",
  },
];

for (const item of cases) {
  test(`${item.heading} exposes its foundational implementation anchor`, async ({ page }) => {
    await page.goto(item.path);
    await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    await expect(page.locator(`a[href="${item.implementationHref}"]`)).toBeVisible();
  });
}
