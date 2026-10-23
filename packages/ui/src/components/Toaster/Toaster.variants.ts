import { cva, type VariantProps } from "class-variance-authority";

// The region is a manual popover, so it renders in the top layer above a Modal opened before it.
// The browser's popover styles center it with a border, padding and Canvas colors; these undo that
// and pin it to a corner or edge instead. The browser also hides it with display: none while
// there are no toasts, so display is left to the list inside. It never gets wider than the
// viewport less a 1rem gutter on each side.
export const toasterVariants = cva(
  [
    "kl:fixed",
    "kl:inset-auto",
    "kl:overflow-visible",
    "kl:w-[min(24rem,calc(100vw-2rem))]",
    "kl:h-auto",
    "kl:m-0",
    "kl:p-0",
    "kl:bg-transparent",
    "kl:border-0",
    "kl:rounded-lg",
    "kl:outline-none",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-4",
    "kl:focus-visible:outline-focus",
  ],
  {
    variants: {
      position: {
        "top-start": ["kl:top-4", "kl:left-4"],
        "top-center": ["kl:inset-x-0", "kl:top-4", "kl:mx-auto"],
        "top-end": ["kl:top-4", "kl:right-4"],
        "bottom-start": ["kl:bottom-4", "kl:left-4"],
        "bottom-center": ["kl:inset-x-0", "kl:bottom-4", "kl:mx-auto"],
        "bottom-end": ["kl:bottom-4", "kl:right-4"],
      },
    },
    defaultVariants: {
      position: "bottom-end",
    },
  },
);

export type ToasterVariantProps = VariantProps<typeof toasterVariants>;

// Toasts are listed oldest first. At the bottom the newest lands nearest the edge; at the top it's
// reversed, so the newest is again nearest the edge and older ones move away from it.
export const toasterListVariants = cva(["kl:flex", "kl:gap-3", "kl:m-0", "kl:p-0", "kl:list-none"], {
  variants: {
    position: {
      "top-start": ["kl:flex-col-reverse"],
      "top-center": ["kl:flex-col-reverse"],
      "top-end": ["kl:flex-col-reverse"],
      "bottom-start": ["kl:flex-col"],
      "bottom-center": ["kl:flex-col"],
      "bottom-end": ["kl:flex-col"],
    },
  },
  defaultVariants: {
    position: "bottom-end",
  },
});
