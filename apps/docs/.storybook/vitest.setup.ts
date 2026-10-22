import { afterEach, beforeEach, expect, vi } from "vitest";
import { commands, page, server } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    /** Defined in vitest.config.ts. */
    resetPointer: () => Promise<void>;
  }
}

// Every story sees the same "today", so the date pickers (which open on the current month and mark
// today) render the same on every run. Noon UTC is the same calendar date in nearly every time zone.
// Only Date is faked, so timers and waitFor run in real time, and the clock still ticks forward.
const TODAY = new Date("2026-03-18T12:00:00Z");

// Start every story with the pointer away from it, so nothing begins in a hover state left over
// from the previous test.
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["Date"], shouldAdvanceTime: true });
  vi.setSystemTime(TODAY);
  await commands.resetPointer();
});

afterEach(() => {
  vi.useRealTimers();
});

// Visual regression: after a story renders and its play function finishes, compare a screenshot
// of the page with the baseline in apps/docs/screenshots. Baselines are generated on GitHub's
// Linux runners (the Update screenshots workflow), and fonts and anti-aliasing render differently
// on macOS, so the comparison only runs on Linux.
//
// Every story is compared except these. Story IDs are `<title>--<story>`, kebab-cased.
const VISUAL_EXCLUDED_PREFIXES = [
  // Their frames depend on playback position, so screenshots aren't stable.
  "media-mediavideo--",
  "media-videomodal--",
  "media-videoplayer--",
];

afterEach(async ({ task }) => {
  // Set by Storybook's Vitest plugin on every story test.
  const { storyId } = task.meta as { storyId?: unknown };
  if (server.platform !== "linux" || typeof storyId !== "string") return;
  if (VISUAL_EXCLUDED_PREFIXES.some((prefix) => storyId.startsWith(prefix))) return;
  // A story that already failed would only add a second, misleading screenshot failure.
  if (task.result?.state === "fail") return;

  // Only the viewport is painted, so a page taller than it would come out blank below the fold.
  // Stretch the viewport to the full page for the screenshot, then put it back.
  const { innerWidth: width, innerHeight: height } = window;
  const fullHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  if (fullHeight > height) await page.viewport(width, fullHeight);
  try {
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(storyId);
  } finally {
    if (fullHeight > height) await page.viewport(width, height);
  }
});
