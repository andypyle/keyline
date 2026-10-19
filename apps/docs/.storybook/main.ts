import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  // Stories live next to their components in each package.
  stories: [
    "../src/**/*.mdx",
    "../../../packages/*/src/**/*.mdx",
    "../../../packages/*/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  viteFinal: (config) => mergeConfig(config, { plugins: [tailwindcss()] }),
};

export default config;
