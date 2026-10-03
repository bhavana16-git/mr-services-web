import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

// Loads the test-account settings from the file we made in Step 10.
dotenv.config({ path: ".env.e2e.local" });

export default defineConfig({
  testDir: "./tests/e2e",
  // Run files one after another, in alphabetical order (01-, 02-, 03-, 04-).
  // With parallel runs switched off, Playwright runs test files in alphabetical order.
  fullyParallel: false,
  workers: 1,
  // A real cloud database is slower than a local one, so be patient.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});


