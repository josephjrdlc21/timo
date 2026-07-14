import { defineConfig } from "vitest/config";

// Root aggregator: runs each app's tests using that app's own vite.config.ts
// (which sets environment: 'jsdom' and its setup file). Add more globs here
// as packages gain their own test configs.
export default defineConfig({
  test: {
    projects: ["client-spa", "iam-admin"],
  },
});
