/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No Tailwind plugin here: these tests assert structure, roles, and state, not
// computed styles, so compiling the stylesheet would only slow the run down.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
