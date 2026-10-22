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
      // Reduced motion turns off the components' transitions, so play functions never measure or
      // click an element mid-animation and screenshots never catch one. Card's hit-testing used to
      // fail intermittently while its lift transition was still settling.
      provider: playwright({ contextOptions: { reducedMotion: "reduce" } }),
      instances: [{ browser: "chromium" }],
      commands: {
        // The pointer stays wherever the last test left it, so a story can start out hovered (Card
        // then lifts, and its hit-testing misses). The setup file calls this before each story to
        // move it to the bottom-right corner, away from where stories render.
        resetPointer: async ({ page }) => {
          const { width, height } = page.viewportSize() ?? { width: 1200, height: 900 };
          await page.mouse.move(width - 1, height - 1);
        },
      },
      // Visual regression baselines (see .storybook/vitest.setup.ts), one per story ID. Only Linux
      // baselines are kept, so the filename leaves out the browser and platform. On a mismatch, the
      // actual and diff images go in .vitest/screenshot-diffs, which CI uploads.
      expect: {
        toMatchScreenshot: {
          // Chromium occasionally renders a pixel or two of anti-aliasing differently between runs.
          // Real changes (a border, a color, spacing, a font) differ by hundreds of pixels.
          comparatorName: "pixelmatch",
          comparatorOptions: { allowedMismatchedPixels: 25 },
          resolveScreenshotPath: ({ arg, ext, root }) => `${root}/screenshots/${arg}${ext}`,
          resolveDiffPath: ({ arg, ext, root }) => `${root}/.vitest/screenshot-diffs/${arg}${ext}`,
        },
      },
    },
  },
});
