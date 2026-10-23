import { cva, type VariantProps } from "class-variance-authority";

// The panel follows Modal's: a surface with a line outline and a hard offset shadow, one step
// smaller to suit a passing message. It slides up on ease-bounce when it opens and pops out when it
// closes; Toast keeps it in the DOM until that exit animation ends. Keyline ships without a CSS
// reset, so box-border is what makes the width include the padding and border.
export const toastVariants = cva(
  [
    "kl:box-border",
    "kl:relative",
    "kl:flex",
    "kl:items-start",
    "kl:gap-3",
    "kl:w-full",
    "kl:max-w-sm",
    "kl:py-3.5",
    "kl:ps-4",
    "kl:font-body",
    "kl:text-fg-1",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-lg",
    "kl:shadow-md",
    "kl:animate-slide-in",
    "kl:data-[state=closed]:animate-pop-out",
    "kl:motion-reduce:animate-none",
    "kl:motion-reduce:data-[state=closed]:animate-none",
  ],
  {
    variants: {
      // Status tones tint the panel with their soft color, so they tell apart at a glance, and the
      // icon carries the full color (toastIconVariants). Neutral stays on the surface. The soft
      // tints turn deep in dark mode, so fg-1 and fg-2 keep their contrast on them in both themes.
      tone: {
        neutral: ["kl:bg-surface"],
        success: ["kl:bg-success-soft"],
        warning: ["kl:bg-warning-soft"],
        danger: ["kl:bg-danger-soft"],
        info: ["kl:bg-info-soft"],
      },
      // The close button sits in the end padding, so the panel's edge is as far from the X as
      // from the icon at the start.
      /** Leaves out the close button. Escape and any ToastAction still close the toast. */
      noCloseButton: {
        true: ["kl:pe-4"],
        false: ["kl:pe-2.5"],
      },
    },
    defaultVariants: {
      tone: "neutral",
      noCloseButton: false,
    },
  },
);

export type ToastVariantProps = VariantProps<typeof toastVariants>;

// The tone's icon sits in a filled disc with the line outline, colored like Badge's filled tones.
// It's nudged down to center on the title's first line.
export const toastIconVariants = cva(
  [
    "kl:flex",
    "kl:shrink-0",
    "kl:items-center",
    "kl:justify-center",
    "kl:size-7",
    "kl:mt-px",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-full",
    "kl:[&_svg]:size-4",
  ],
  {
    variants: {
      tone: {
        neutral: ["kl:bg-sunken", "kl:text-fg-1"],
        success: ["kl:bg-success-fill", "kl:text-on-fill"],
        warning: ["kl:bg-warning", "kl:text-on-fill"],
        // Rust and dusk are too dark for on-fill text, so these two take white.
        danger: ["kl:bg-danger", "kl:text-white"],
        info: ["kl:bg-info", "kl:text-white"],
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type ToastIconVariantProps = VariantProps<typeof toastIconVariants>;
