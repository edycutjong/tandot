import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "demo-studio.spec.ts",
  fullyParallel: false, // Ensure sequential execution for clean video
  forbidOnly: false,
  retries: 0,
  workers: 1, // Only 1 worker for demo recording
  reporter: "list",
  outputDir: "../../DemoStudio/013_Tandot/playwright-output",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    screenshot: "on",
    video: "on",
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
