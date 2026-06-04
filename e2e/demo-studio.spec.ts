import { test, expect } from "@playwright/test";

test.describe("DemoStudio Asset Generation Flow", () => {
  // Increase test timeout to allow for slow human typing
  test.setTimeout(120_000);

  test("should record landing page scroll showcase", async ({ page }) => {
    // 1. Landing Page
    await page.goto("/");
    await page.waitForTimeout(1500); // Wait for initial animations

    // Smooth scroll to bottom
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      for (let i = 0; i <= scrollHeight; i += 15) {
        window.scrollTo(0, i);
        await delay(20);
      }
    });

    await page.waitForTimeout(1500); // Pause at bottom

    // Smooth scroll to top
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      for (let i = scrollHeight; i >= 0; i -= 20) {
        window.scrollTo(0, i);
        await delay(20);
      }
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(1500); // Pause at top
  });

  test("should record slow, human-like flow and take screenshots", async ({ page }) => {
    // 1. Landing Page
    await page.goto("/");
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: "../../DemoStudio/013_Tandot/demo-assets/landing-hero.png" });

    // 2. Click Launch App
    const launchBtn = page.getByRole("link", { name: /Iniciar App|Launch App/i });
    await launchBtn.click();

    // 3. Dashboard
    await page.waitForURL("**/dashboard");
    await expect(page.locator("body")).toBeVisible();
    await page.waitForTimeout(1500); // Wait for numbers to count up/animations
    await page.screenshot({ path: "../../DemoStudio/013_Tandot/demo-assets/dashboard-overview.png" });

    // 4. Demonstrate Sidebar Capabilities 1 by 1
    const sidebarItems = [
      /Mis Tandas|My Tandas/i,
      /Historial|History/i,
      /Explorador|Explorer/i,
      /IA Trust Score|AI Trust Score/i,
    ];

    for (const item of sidebarItems) {
      await page.getByRole("link", { name: item }).click();
      await page.waitForTimeout(1500); // Pause to showcase each view
    }

    // Take screenshot of AI panel since it was the last item
    await page.screenshot({ path: "../../DemoStudio/013_Tandot/demo-assets/ai-trust-score.png" });

    // 5. Create Tanda Flow
    await page.getByRole("link", { name: /Nueva Tanda|New Tanda/i }).click();
    await expect(page.locator("h1")).toContainText(/Create|Crear/i);
    
    // Slow typing
    await page.getByPlaceholder(/ej. Tanda Navideña 2026|e.g. Holiday Tanda 2026/i)
      .pressSequentially("Holiday Tanda 2026", { delay: 100 });
    
    await page.waitForTimeout(500);
    await page.getByPlaceholder("1,000").pressSequentially("2000", { delay: 100 });
    
    await page.waitForTimeout(500);
    await page.getByPlaceholder("10").pressSequentially("10", { delay: 100 });
    
    await page.waitForTimeout(500);
    await page.getByPlaceholder(/Describe/i).pressSequentially("Trustless savings pool with BOT Chain Escrow.", { delay: 50 });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "../../DemoStudio/013_Tandot/demo-assets/tanda-creation-form.png" });

    // Form submission
    page.on("dialog", async (dialog) => {
      await page.waitForTimeout(1000); // Let viewer see the dialog
      await dialog.accept();
    });

    await page.getByRole("button", { name: /Create Tanda with Escrow|Crear Tanda con Escrow/i }).click({ force: true });

    // Wait a little bit after submission
    await page.waitForTimeout(1500);

    // 6. View Specific Tanda Details (Payout Timeline)
    // We navigate to the first active mock tanda to show escrow status
    await page.goto("/dashboard/tandas/d41f5312-214e-4030-8047-1a7743bcbc39");
    await page.waitForTimeout(1500); // Wait for timeline render
    await page.screenshot({ path: "../../DemoStudio/013_Tandot/demo-assets/payout-timeline.png" });

    // End of recording
    await page.waitForTimeout(1500);
  });
});
