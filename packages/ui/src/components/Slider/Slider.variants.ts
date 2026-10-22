import { cva, type VariantProps } from "class-variance-authority";

// The root is the slider itself (role="slider"), sized to the thumb across and to its container
// along. It sets the sizes the track and thumb read: --kl-slider-thumb and --kl-slider-track.
// --kl-slider-ratio (0 to 1, set inline from the value) places the thumb and fills the range. The
// thumb travels the length less its own size, so it never hangs past either end, and the range
// fills to the thumb's centre. Focus shows as a ring on the thumb, not the whole root.
export const sliderVariants = cva(
  [
    "kl:group/slider",
    "kl:relative",
    "kl:shrink-0",
    "kl:outline-hidden",
    "kl:cursor-pointer",
    "kl:select-none",
    "kl:aria-disabled:opacity-45",
    "kl:aria-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      // Touch keeps scrolling the page across the slider, and drags along it.
      orientation: {
        horizontal: ["kl:w-full", "kl:h-(--kl-slider-thumb)", "kl:touch-pan-y"],
        vertical: ["kl:w-(--kl-slider-thumb)", "kl:h-40", "kl:touch-pan-x"],
      },
      size: {
        sm: ["kl:[--kl-slider-thumb:16px]", "kl:[--kl-slider-track:8px]"],
        md: ["kl:[--kl-slider-thumb:20px]", "kl:[--kl-slider-track:10px]"],
        lg: ["kl:[--kl-slider-thumb:24px]", "kl:[--kl-slider-track:12px]"],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  },
);

export type SliderVariantProps = VariantProps<typeof sliderVariants>;

export const sliderTrackVariants = cva(
  [
    "kl:box-border",
    "kl:absolute",
    "kl:overflow-hidden",
    "kl:bg-sunken",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-full",
    "kl:pointer-events-none",
    "kl:group-aria-invalid/slider:border-danger",
  ],
  {
    variants: {
      orientation: {
        horizontal: ["kl:inset-x-0", "kl:top-1/2", "kl:-translate-y-1/2", "kl:h-(--kl-slider-track)"],
        vertical: ["kl:inset-y-0", "kl:left-1/2", "kl:-translate-x-1/2", "kl:w-(--kl-slider-track)"],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export type SliderTrackVariantProps = VariantProps<typeof sliderTrackVariants>;

// The filled part of the track, from the minimum to the thumb.
export const sliderRangeVariants = cva(["kl:absolute", "kl:bg-control"], {
  variants: {
    orientation: {
      horizontal: [
        "kl:inset-y-0",
        "kl:left-0",
        "kl:w-[calc(var(--kl-slider-thumb)/2+(100%-var(--kl-slider-thumb))*var(--kl-slider-ratio))]",
      ],
      vertical: [
        "kl:inset-x-0",
        "kl:bottom-0",
        "kl:h-[calc(var(--kl-slider-thumb)/2+(100%-var(--kl-slider-thumb))*var(--kl-slider-ratio))]",
      ],
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type SliderRangeVariantProps = VariantProps<typeof sliderRangeVariants>;

export const sliderThumbVariants = cva(
  [
    "kl:box-border",
    "kl:absolute",
    "kl:size-(--kl-slider-thumb)",
    "kl:bg-thumb",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-full",
    "kl:shadow-sm",
    "kl:transition-colors",
    "kl:duration-120",
    "kl:ease-out",
    "kl:pointer-events-none",
    "kl:group-hover/slider:bg-thumb-hover",
    "kl:group-focus-visible/slider:outline-3",
    "kl:group-focus-visible/slider:outline-offset-2",
    "kl:group-focus-visible/slider:outline-focus",
    "kl:group-aria-disabled/slider:bg-thumb",
    "kl:group-aria-invalid/slider:border-danger",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "kl:top-1/2",
          "kl:left-[calc((100%-var(--kl-slider-thumb))*var(--kl-slider-ratio))]",
          "kl:-translate-y-1/2",
        ],
        vertical: [
          "kl:bottom-[calc((100%-var(--kl-slider-thumb))*var(--kl-slider-ratio))]",
          "kl:left-1/2",
          "kl:-translate-x-1/2",
        ],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export type SliderThumbVariantProps = VariantProps<typeof sliderThumbVariants>;
