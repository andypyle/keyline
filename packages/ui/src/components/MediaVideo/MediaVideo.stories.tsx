import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { MediaVideo } from "./MediaVideo";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 } as const;
const width = { width: 320 } as const;

// Served from apps/docs/public. WebM, because the Chromium the tests run in can't play H.264.
const src = "media/sample.webm";
const poster = "media/sample-poster.jpg";

const meta = {
  title: "Media/MediaVideo",
  component: MediaVideo,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=27-83" },
  },
  args: { src, poster, style: width, "aria-label": "Light drifting across a field" },
  argTypes: {
    ratio: { control: "select", options: ["auto", "1/1", "4/3", "3/2", "16/9", "21/9", "3/4", "9/16"] },
    fit: { control: "inline-radio", options: ["cover", "contain"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg", "xl"] },
  },
  render: (args) => (
    <MediaVideo {...args}>
      <track kind="captions" src="media/sample.en.vtt" srcLang="en" label="English" default />
    </MediaVideo>
  ),
} satisfies Meta<typeof MediaVideo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const video = canvasElement.querySelector("video")!;

    await step("shows the browser's controls and plays inline by default", async () => {
      await expect(video).toHaveAttribute("controls");
      await expect(video).toHaveAttribute("playsinline");
    });

    await step("passes native attributes through to the video", async () => {
      await expect(video).toHaveAttribute("poster", poster);
      await expect(video).toHaveAccessibleName("Light drifting across a field");
    });
  },
};

/** `controls={false}` hides the controls, for a video you play from your own UI through its ref. */
export const WithoutControls: Story = {
  args: { controls: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("video")).not.toHaveAttribute("controls");
  },
};

/** `ratio` crops to a fixed shape; `fit="contain"` letterboxes instead. */
export const Ratios: Story = {
  render: (args) => (
    <div style={row}>
      <MediaVideo {...args} ratio="1/1" style={{ width: 200 }} />
      <MediaVideo {...args} ratio="9/16" style={{ width: 160 }} />
      <MediaVideo {...args} ratio="1/1" fit="contain" style={{ width: 200 }} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <MediaVideo {...args} />
      <MediaVideo {...args} flat />
      <MediaVideo {...args} noBorders />
    </div>
  ),
};

/** Dark mode swaps the outline and the background, so contrast is checked here too. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
