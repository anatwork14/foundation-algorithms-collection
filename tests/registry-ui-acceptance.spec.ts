import { expect, test } from "@playwright/test";

const registries = [
  {
    route: "/references",
    toolbar: ".reference-controls",
    searchName: "Search references",
    selectNames: [
      "Filter references by type",
      "Filter references by evidence role",
      "Filter references by source notice",
    ],
  },
  {
    route: "/implementations",
    toolbar: ".implementation-controls",
    searchName: "Search implementations",
    selectNames: ["Filter implementations by maturity"],
  },
  {
    route: "/experiments",
    toolbar: ".experiment-controls",
    searchName: "Search experiments",
    selectNames: ["Filter experiments by status"],
  },
] as const;

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "phone", width: 390, height: 844 },
]) {
  test.describe(`registry toolbar consistency · ${viewport.name}`, () => {
    for (const registry of registries) {
      test(`${registry.route} uses the canonical accessible filter shell`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const response = await page.goto(registry.route, { waitUntil: "domcontentloaded" });
        expect(response?.ok()).toBeTruthy();

        const toolbar = page.locator(registry.toolbar);
        await expect(toolbar).toBeVisible();

        const search = page.getByRole("searchbox", { name: registry.searchName });
        await expect(search).toBeVisible();

        for (const name of registry.selectNames) {
          await expect(page.getByRole("combobox", { name })).toBeVisible();
        }

        const geometry = await toolbar.evaluate((element) => {
          const controls = [
            ...element.querySelectorAll<HTMLElement>("label, select"),
          ].filter((control) => control.getClientRects().length > 0);

          return controls.map((control) => ({
            tag: control.tagName.toLowerCase(),
            height: Math.round(control.getBoundingClientRect().height),
          }));
        });

        expect(geometry.length).toBeGreaterThan(0);
        for (const control of geometry) {
          expect(
            control.height,
            `${registry.route} ${control.tag} height should follow the shared ~42px control rhythm`,
          ).toBeGreaterThanOrEqual(40);
          expect(control.height).toBeLessThanOrEqual(46);
        }

        const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(pageOverflow).toBeLessThanOrEqual(1);
      });
    }
  });
}
