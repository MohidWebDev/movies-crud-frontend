import { defineConfig, devices } from "@playwright/test";

// Dedicated ports, so E2E never collides with your normal dev servers
const FRONTEND_PORT = 5174;
const BACKEND_PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  // One test at a time: the tests will share one seeded database
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    // A step-by-step recording, kept only when a test fails
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Playwright starts the frontend itself and waits until it answers
  webServer: {
    command: "npm run dev:e2e",
    url: `http://localhost:${FRONTEND_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Points the app at the test backend (port 3100), never your real API
    env: { VITE_API_BASE_URL: `http://localhost:${BACKEND_PORT}` },
  },
});
