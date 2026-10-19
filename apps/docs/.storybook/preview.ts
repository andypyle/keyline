import type { Preview } from "@storybook/react-vite";

// Load the library's source stylesheet so Tailwind rebuilds as components change.
import "../../../packages/ui/src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
