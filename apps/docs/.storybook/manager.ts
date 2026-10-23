import { createElement } from "react";
import { Button } from "storybook/internal/components";
import { addons, types, useParameter } from "storybook/manager-api";

// The manager inlines fonts into its CSS, so load only what Storybook's UI uses: Latin text in
// regular and bold, and regular mono. Stories get the full set from the library's fonts.css.
import "@fontsource/figtree/latin-400.css";
import "@fontsource/figtree/latin-700.css";
import "@fontsource/geist-mono/latin-400.css";
import { darkTheme, lightTheme } from "./theme";

// Storybook's own UI follows the OS setting. The toolbar's theme switch only changes the stories.
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: prefersDark ? darkTheme : lightTheme,
});

// Storybook ends every tab title with "⋅ Storybook" whatever brandTitle says, so swap it as
// each title is set. Setting the title fires the observer again, but then there's no change.
const retitle = () => {
  const title = document.title.replace(/Storybook$/, "Keyline");
  if (title !== document.title) document.title = title;
};
const titleElement = document.querySelector("title");
if (titleElement) new MutationObserver(retitle).observe(titleElement, { childList: true });
retitle();

// A link at the toolbar's right end to the story's frame in the Figma file, read from
// `parameters.design`, the shape @storybook/addon-designs uses. Each component's meta points at
// its Figma page; a story can point somewhere more specific. Without a URL there's no link.
interface DesignParameter {
  type?: string;
  url?: string;
}

const externalIcon = createElement(
  "svg",
  {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  },
  createElement("path", { d: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" }),
);

function FigmaLink() {
  const design = useParameter<DesignParameter | undefined>("design");
  if (design?.type !== "figma" || !design.url) return null;
  return createElement(
    Button,
    { asChild: true, variant: "ghost", padding: "small", ariaLabel: false, tooltip: "Open in Figma" },
    createElement("a", { href: design.url, target: "_blank", rel: "noopener noreferrer" }, externalIcon, "Figma"),
  );
}

addons.register("keyline/figma-link", () => {
  addons.add("keyline/figma-link/tool", {
    type: types.TOOLEXTRA,
    title: "Open in Figma",
    render: FigmaLink,
  });
});
