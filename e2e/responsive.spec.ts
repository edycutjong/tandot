import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 }
];

test.describe("Viewport Responsiveness Checks", () => {
  for (const viewport of VIEWPORTS) {
    test(`should render correctly on ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");

      // Ensure main content areas are present
      await expect(page.locator("nav")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      // Verify no horizontal scrollbar / overflow
      const horizontalScrollable = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(horizontalScrollable).toBe(false);
    });
  }
});
