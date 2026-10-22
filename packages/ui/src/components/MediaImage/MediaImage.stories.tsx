import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentPropsWithRef } from "react";
import { expect } from "storybook/test";
import { MediaImage } from "./MediaImage";
import { mediaImageVariants } from "./MediaImage.variants";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 } as const;
const width = { width: 320 } as const;

const landscape = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
    <rect width="320" height="180" fill="#c9d6c2"/>
    <circle cx="236" cy="62" r="30" fill="#e8c27a"/>
    <path d="M0 180 L96 84 L168 150 L212 112 L320 180 Z" fill="#6f8f68"/>
  </svg>`,
)}`;

const portrait = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 320" width="180" height="320">
    <rect width="180" height="320" fill="#c9d6c2"/>
    <circle cx="120" cy="70" r="28" fill="#e8c27a"/>
    <path d="M0 320 L0 210 L70 140 L120 200 L180 150 L180 320 Z" fill="#6f8f68"/>
  </svg>`,
)}`;

const alt = "Green hills under an afternoon sun";

const meta = {
  title: "Media/MediaImage",
  component: MediaImage,
  tags: ["autodocs"],
  args: { src: landscape, alt, style: width },
  argTypes: {
    ratio: { control: "select", options: ["auto", "1/1", "4/3", "3/2", "16/9", "21/9", "3/4", "9/16"] },
    fit: { control: "inline-radio", options: ["cover", "contain"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof MediaImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { loading: "lazy" },
  play: async ({ canvas, step }) => {
    const image = canvas.getByRole("img", { name: alt });

    await step("passes native attributes through to the img", async () => {
      await expect(image).toHaveAttribute("loading", "lazy");
      await expect(image).toHaveAttribute("src", landscape);
    });
  },
};

/** `alt=""` marks an image as decorative, so assistive tech skips it. */
export const Decorative: Story = {
  args: { alt: "" },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=media-image]")).toBeInTheDocument();
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};

/** `ratio` crops to a fixed shape; `auto` keeps the image's own. */
export const Ratios: Story = {
  render: (args) => (
    <div style={row}>
      {(["auto", "1/1", "4/3", "16/9", "21/9", "3/4", "9/16"] as const).map((ratio) => (
        <figure key={ratio} style={{ margin: 0, width: ratio === "9/16" || ratio === "3/4" ? 160 : 240 }}>
          <MediaImage {...args} ratio={ratio} style={undefined} />
          <figcaption style={{ marginTop: 8, fontFamily: "monospace" }}>{ratio}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

/** `fit="contain"` shows the whole image inside the frame instead of cropping it. */
export const Contain: Story = {
  args: { src: portrait, ratio: "16/9", fit: "contain" },
};

/** `flat` keeps the outline but drops the shadow. */
export const Flat: Story = {
  args: { flat: true },
};

/** `noBorders` drops the outline, and with it the shadow. */
export const NoBorders: Story = {
  args: { noBorders: true },
};

export const Radius: Story = {
  render: (args) => (
    <div style={row}>
      {(["none", "sm", "md", "lg", "xl"] as const).map((radius) => (
        <MediaImage key={radius} {...args} radius={radius} ratio="1/1" style={{ width: 160 }} />
      ))}
    </div>
  ),
};

// Stands in for next/image or similar: a component that renders an <img> and accepts a className.
function FrameworkImage(props: ComponentPropsWithRef<"img">) {
  return <img data-framework-image {...props} />;
}

/**
 * Framework image components (`next/image`, Astro's `<Image>`, Unpic, …) optimise and resize
 * images. Keep them, and give them Keyline's frame with `mediaImageVariants()`, which returns the
 * same classes `MediaImage` uses.
 *
 * ```tsx
 * import Image from "next/image";
 * import { mediaImageVariants } from "@keyline/ui";
 *
 * <Image src={hero} alt="…" className={mediaImageVariants({ ratio: "16/9" })} />
 * ```
 *
 * ```astro
 * ---
 * import { Image } from "astro:assets";
 * import { mediaImageVariants } from "@keyline/ui";
 * ---
 * <Image src={hero} alt="…" class={mediaImageVariants({ ratio: "16/9" })} />
 * ```
 *
 * With `next/image`'s `fill`, the image is positioned inside a parent you size, so put the ratio
 * and frame on that parent instead (with `position: relative` and `overflow: hidden`).
 */
export const FrameworkImageComponents: Story = {
  render: (args) => (
    <FrameworkImage src={args.src} alt={args.alt} style={width} className={mediaImageVariants({ ratio: "16/9" })} />
  ),
  parameters: {
    docs: {
      source: {
        code: `<Image src={hero} alt="${alt}" className={mediaImageVariants({ ratio: "16/9" })} />`,
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: alt })).toHaveAttribute("data-framework-image");
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <MediaImage {...args} ratio="4/3" />
      <MediaImage {...args} ratio="4/3" flat />
      <MediaImage {...args} ratio="4/3" noBorders />
      <MediaImage {...args} src={portrait} ratio="4/3" fit="contain" />
    </div>
  ),
};

/** Dark mode swaps the outline and the background behind `contain`, so contrast is checked here too. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
