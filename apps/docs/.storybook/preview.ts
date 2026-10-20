import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

// Load the library's source stylesheets so Tailwind rebuilds as components change.
import "../../../packages/ui/src/styles/fonts.css";
import "../../../packages/ui/src/styles/index.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Axe checks every story; violations fail `pnpm test`, not just show in the panel.
    a11y: { test: "error" },
    options: {
      storySort: { order: ["Introduction", "Foundations", ["Colors", "Typography", "Shape & Layout", "Motion"], "Components"] },
    },
  },
  decorators: [
    // Dark mode is opt-in, exactly as consumers turn it on: data-theme on <html>.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
