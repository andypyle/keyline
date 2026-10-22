import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";
import { createElement } from "react";

// Load the library's source stylesheets so Tailwind rebuilds as components change.
import "../../../packages/ui/src/styles/fonts.css";
import "../../../packages/ui/src/styles/index.css";
import "./preview.css";
import { lightTheme } from "./theme";

// A Docs page renders every story in one document, so a story's own theme global (like the
// `Variants (dark)` stories' `globals: { theme: "dark" }`) can't go on <html> there. data-theme
// works on any element, so put it on that story's preview block instead.
const withDocsStoryTheme: Decorator = (Story, context) => {
  const theme = context.storyGlobals?.theme;
  if (context.viewMode !== "docs" || typeof theme !== "string") return Story();
  return createElement(
    "div",
    {
      style: { display: "contents" },
      ref: (node: HTMLDivElement | null) => {
        node?.closest(".docs-story")?.setAttribute("data-theme", theme);
      },
    },
    Story(),
  );
};

const preview: Preview = {
  parameters: {
    // Docs pages stay light; story blocks on them follow their own theme (see withDocsStoryTheme).
    docs: { theme: lightTheme },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Axe checks every story; violations fail `pnpm test`, not just show in the panel.
    a11y: { test: "error" },
    // Each top-level section is a sidebar heading. Components within a section sort alphabetically,
    // except Forms, which runs from Field, which wraps the rest, through the text fields to the
    // choice controls, with each group's member after the group, then Slider, and ends with
    // Examples that combine them.
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Colors", "Typography", "Shape & Layout", "Motion"],
          "Buttons",
          "Display",
          "Forms",
          ["Field", "Input", "Textarea", "Select", "Combobox", "Checkbox", "RadioGroup", "Radio", "Switch", "Slider", "Examples"],
          "Layout",
          "Media",
          "Overlays",
        ],
      },
    },
  },
  // withThemeByDataAttribute applies the theme in an effect that, in the dev server, only runs once
  // the play function and the axe check have finished, so a dark story would be tested in light
  // mode. Set it before the story renders as well; the decorator still drives the toolbar. Docs
  // pages are left alone: withDocsStoryTheme scopes a story's theme to its preview block there.
  beforeEach: ({ globals, viewMode }) => {
    if (viewMode === "docs") return;
    document.documentElement.setAttribute("data-theme", typeof globals.theme === "string" && globals.theme ? globals.theme : "light");
  },
  decorators: [
    // Dark mode is opt-in, exactly as consumers turn it on: data-theme on <html>.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    withDocsStoryTheme,
  ],
};

export default preview;
