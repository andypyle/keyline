import { addons } from "storybook/manager-api";

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
