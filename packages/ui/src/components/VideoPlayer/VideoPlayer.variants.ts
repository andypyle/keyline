import { cva, type VariantProps } from "class-variance-authority";

// The frame around the video and its controls bar. The parts read two custom properties from here:
// --kl-video-player-ratio shapes the video's area, and --kl-video-player-border sizes the outline (the
// controls bar's divider matches it). In full screen (data-fullscreen) the frame drops away and the
// video fills the screen above the bar.
export const videoPlayerVariants = cva(
  [
    "kl:group/video-player",
    "kl:@container/video-player",
    "kl:[--kl-video-player-border:3px]",
    "kl:relative",
    "kl:flex",
    "kl:flex-col",
    "kl:overflow-hidden",
    "kl:max-w-full",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-(length:--kl-video-player-border)",
    "kl:border-line",
    "kl:data-fullscreen:[--kl-video-player-border:0px]",
    "kl:data-fullscreen:rounded-none",
    "kl:data-fullscreen:shadow-none",
  ],
  {
    variants: {
      /** The width/height ratio of the video's area; a video of another shape is letterboxed. `auto` takes the video's own. */
      ratio: {
        auto: ["kl:[--kl-video-player-ratio:auto]"],
        "1/1": ["kl:[--kl-video-player-ratio:1/1]"],
        "4/3": ["kl:[--kl-video-player-ratio:4/3]"],
        "16/9": ["kl:[--kl-video-player-ratio:16/9]"],
        "21/9": ["kl:[--kl-video-player-ratio:21/9]"],
        "9/16": ["kl:[--kl-video-player-ratio:9/16]"],
      },
      radius: {
        none: ["kl:rounded-none"],
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
      /** Removes the shadow, keeping the outline. */
      flat: {
        true: [],
        false: [],
      },
      /** Removes the outline and the controls bar's divider, and with them the shadow. */
      noBorders: {
        true: ["kl:[--kl-video-player-border:0px]"],
        false: [],
      },
    },
    compoundVariants: [{ flat: false, noBorders: false, class: ["kl:shadow-lg"] }],
    defaultVariants: {
      ratio: "16/9",
      radius: "lg",
      flat: false,
      noBorders: false,
    },
  },
);

export type VideoPlayerVariantProps = VariantProps<typeof videoPlayerVariants>;
