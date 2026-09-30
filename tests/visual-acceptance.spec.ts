import { expect, test, type Page, type TestInfo } from "@playwright/test";

const THEME_STORAGE_KEY = "foundation-algorithms-theme";

const viewports = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 820, height: 1180 },
  phone: { width: 390, height: 844 },
} as const;

type Theme = "light" | "dark";
type ViewportName = keyof typeof viewports;

type VisualScenario = {
  name: string;
  route: string;
  theme: Theme;
  viewport: ViewportName;
};

const scenarios: VisualScenario[] = [
  { name: "home-light-desktop", route: "/", theme: "light", viewport: "desktop" },
  { name: "home-light-tablet", route: "/", theme: "light", viewport: "tablet" },
  { name: "home-light-phone", route: "/", theme: "light", viewport: "phone" },
  { name: "home-dark-desktop", route: "/", theme: "dark", viewport: "desktop" },
  { name: "home-dark-tablet", route: "/", theme: "dark", viewport: "tablet" },
  { name: "home-dark-phone", route: "/", theme: "dark", viewport: "phone" },
  { name: "chapter-light-desktop", route: "/archive/08-bandits-contextual-bandits-linucb", theme: "light", viewport: "desktop" },
  { name: "chapter-dark-phone", route: "/archive/08-bandits-contextual-bandits-linucb", theme: "dark", viewport: "phone" },
  { name: "algorithms-light-desktop", route: "/algorithms", theme: "light", viewport: "desktop" },
  { name: "algorithms-dark-phone", route: "/algorithms", theme: "dark", viewport: "phone" },
  { name: "atlas-light-desktop", route: "/atlas", theme: "light", viewport: "desktop" },
  { name: "atlas-dark-phone", route: "/atlas", theme: "dark", viewport: "phone" },
  { name: "lab-light-desktop", route: "/lab", theme: "light", viewport: "desktop" },
  { name: "lab-dark-phone", route: "/lab", theme: "dark", viewport: "phone" },
  { name: "evidence-light-desktop", route: "/evidence", theme: "light", viewport: "desktop" },
  { name: "evidence-dark-phone", route: "/evidence", theme: "dark", viewport: "phone" },
  { name: "references-light-desktop", route: "/references", theme: "light", viewport: "desktop" },
  { name: "references-dark-phone", route: "/references", theme: "dark", viewport: "phone" },
];

async function openScenario(page: Page, scenario: VisualScenario) {
  await page.setViewportSize(viewports[scenario.viewport]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: THEME_STORAGE_KEY, value: scenario.theme },
  );

  const response = await page.goto(scenario.route, { waitUntil: "networkidle" });
  expect(response, `No navigation response for ${scenario.route}`).not.toBeNull();
  expect(response?.ok(), `Expected ${scenario.route} to render successfully`).toBeTruthy();
  await expect(page.locator("html")).toHaveAttribute("data-theme", scenario.theme);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function attachFullPageSnapshot(page: Page, testInfo: TestInfo, name: string) {
  const image = await page.screenshot({ fullPage: true, animations: "disabled" });
  await testInfo.attach(`${name}.png`, {
    body: image,
    contentType: "image/png",
  });
}

test.describe("visual review artifacts", () => {
  for (const scenario of scenarios) {
    test(`captures ${scenario.name}`, async ({ page }, testInfo) => {
      await openScenario(page, scenario);
      await attachFullPageSnapshot(page, testInfo, scenario.name);
    });
  }
});
