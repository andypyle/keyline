import { afterEach, beforeEach, expect } from "vitest";
import { commands, page, server } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    /** Defined in vitest.config.ts. */
    resetPointer: () => Promise<void>;
  }
}

// Start every story with the pointer away from it, so nothing begins in a hover state left over
// from the previous test.
beforeEach(async () => {
  await commands.resetPointer();
});

// Visual regression: after a story renders and its play function finishes, compare a screenshot
// of the page with the baseline in apps/docs/screenshots. Baselines are generated on GitHub's
// Linux runners (the Update screenshots workflow), and fonts and anti-aliasing render differently
// on macOS, so the comparison only runs on Linux.
//
// Prototype: only these components are compared for now. Story IDs are `<title>--<story>`, kebab-cased.
const VISUAL_STORY_PREFIXES = ["buttons-button--", "layout-card--"];

afterEach(async ({ task }) => {
  // Set by Storybook's Vitest plugin on every story test.
  const { storyId } = task.meta as { storyId?: unknown };
  if (server.platform !== "linux" || typeof storyId !== "string") return;
  if (!VISUAL_STORY_PREFIXES.some((prefix) => storyId.startsWith(prefix))) return;
  // A story that already failed would only add a second, misleading screenshot failure.
  if (task.result?.state === "fail") return;

  await expect.element(page.elementLocator(document.body)).toMatchScreenshot(storyId);
});
