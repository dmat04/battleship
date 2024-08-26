import { mergeConfig, defineProject, defineConfig } from "vitest/config";
import rootConfig from "../../vitest.config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default mergeConfig(
  rootConfig,
  defineConfig({
    plugins: [
      react(),
      svgr({
        include: "**/*.svg"
      })],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./test/setup.ts",
      env: {
        API_URL: "",
        WS_URL: "ws://localhost:5000/",
      },
      coverage: {
        enabled: true,
        all: false,
        reportsDirectory: './test/coverage'
      },
    },
  }),
);
