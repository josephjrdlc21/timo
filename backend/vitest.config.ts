import { defineConfig } from "vitest/config";

// The integration suites share the single local MySQL database, so they must
// not run concurrently — hence forks with parallelism off. Unit suites are
// cheap enough that serialising them costs nothing.
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
    pool: "forks",
    fileParallelism: false,
  },
});
