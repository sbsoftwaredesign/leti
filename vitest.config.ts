/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    name: "unit",
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      all: true,
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts", "src/components/**/*.tsx"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 85,
        branches: 85,
        functions: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@layouts": "/src/layouts",
      "@lib": "/src/lib",
      "@styles": "/src/styles",
      "@content": "/src/content",
    },
  },
});
