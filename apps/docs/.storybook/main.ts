import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  // Stories live next to their components in each package.
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
    "../../../packages/*/src/**/*.mdx",
    "../../../packages/*/src/**/*.stories.@(ts|tsx)",
  ],
  // Sample media for the Media stories, served from the root of the preview.
  staticDirs: ["../public"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes", "@storybook/addon-vitest", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  viteFinal: (config) => mergeConfig(config, { plugins: [tailwindcss()] }),
};

export default config;
