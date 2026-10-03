import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
    test: {
    environment: "jsdom",
    setupFiles: "./tests/unit/setup.ts",
    globals: true,
    // Only run the unit tests. Without this line Vitest would also pick up the
    // Playwright files in tests/e2e/ (they end in .spec.ts) and crash on them.
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});


