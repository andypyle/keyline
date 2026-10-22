import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Runs every story as a test in headless Chromium: each story must render, and its play
// function (if any) must pass. See https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [storybookTest()],
  test: {
    name: "storybook",
    setupFiles: ["./.storybook/vitest.setup.ts"],
    // toMatchScreenshot writes baselines and diffs to disk. Storybook's plugin turns file writes off
    // unless they're allowed here; the host stays local so the server isn't exposed to the network.
    api: { host: "127.0.0.1", allowWrite: true },
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      // Visual regression baselines (see .storybook/vitest.setup.ts), one per story ID. Only Linux
      // baselines are kept, so the filename leaves out the browser and platform. On a mismatch, the
      // actual and diff images go in .vitest/screenshot-diffs, which CI uploads.
      expect: {
        toMatchScreenshot: {
          resolveScreenshotPath: ({ arg, ext, root }) => `${root}/screenshots/${arg}${ext}`,
          resolveDiffPath: ({ arg, ext, root }) => `${root}/.vitest/screenshot-diffs/${arg}${ext}`,
        },
      },
    },
  },
});
