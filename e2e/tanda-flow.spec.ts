import { test, expect } from "@playwright/test";

test.describe("Tanda Creation Flow", () => {
  test("should fill out and submit the Tanda creation form", async ({ page }) => {
    // Navigate directly to the create tanda page
    await page.goto("/dashboard/create");

    // Check title presence
    await expect(page.locator("h1")).toContainText(/Crear Nueva Tanda|Create New Tanda/i);

    // Locate and fill fields
    const nameInput = page.getByPlaceholder(/ej. Tanda Navideña 2026|e.g. Holiday Tanda 2026/i);
    await expect(nameInput).toBeVisible();
    await nameInput.fill("E2E Test Holiday Tanda");

    const amountInput = page.getByPlaceholder("1,000");
    await expect(amountInput).toBeVisible();
    await amountInput.fill("2500");

    const membersInput = page.getByPlaceholder("10");
    await expect(membersInput).toBeVisible();
    await membersInput.fill("12");

    const descTextarea = page.getByPlaceholder(/Describe tu tanda para atraer miembros...|Describe your tanda to attract members.../i);
    await expect(descTextarea).toBeVisible();
    await descTextarea.fill("An E2E test generated Tanda group with isolated Arbitrum escrow.");

    // Handle dialog modal overlay
    let dialogTriggered = false;
    page.on("dialog", async (dialog) => {
      dialogTriggered = true;
      expect(dialog.message()).toContain("Arbitrum");
      await dialog.accept();
    });

    // Click submit button
    const submitBtn = page.getByRole("button", { name: /Crear Tanda con Escrow|Create Tanda with Escrow/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click({ force: true });

    // Verify dialog was accepted
    expect(dialogTriggered).toBe(true);
  });
});
