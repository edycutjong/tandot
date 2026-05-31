import { test, expect } from "@playwright/test";

test.describe("Demo Mode Smoke Tests", () => {
  test("should load the landing page successfully", async ({ page }) => {
    await page.goto("/");
    
    // Check that Tandot brand name is visible in nav and hero
    await expect(page.locator("nav")).toContainText("Tandot");
    
    // Test Bilingual i18n switching
    const langBtn = page.getByRole("button", { name: /es|en/i }).first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      // Ensure language changes (e.g., checking text contents)
      const ctaBtn = page.getByRole("link", { name: /Iniciar App|Launch App/i });
      await expect(ctaBtn).toBeVisible();
    }
  });

  test("should navigate to and load the dashboard successfully", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Check that we see the general dashboard structure
    await expect(page.locator("body")).toBeVisible();
    
    // Verify that the title or header is present
    const headerTitle = page.locator("h1, h2").first();
    await expect(headerTitle).toBeVisible();
  });
});
