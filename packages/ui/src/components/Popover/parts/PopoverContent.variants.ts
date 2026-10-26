import { cva, type VariantProps } from "class-variance-authority";

// Shares DropdownMenuContent's look and motion: a manual popover in the top layer, so no overflow
// or stacking context can clip it, tethered to the Popover by its anchor name. The browser hides
// closed popovers with display: none, so display is only set while open, and transition-discrete
// keeps the fade running through the switch. Opening grows the panel out of the trigger on
// ease-bounce; closing takes the base timing, a quicker ease-out with no bounce.
//
// It sizes to its content up to a readable width, and scrolls when taller than the viewport. The
// content sits in a body column beside the optional icon (popoverBodyVariants). Keyline ships
// without a CSS reset, so box-border is what makes the caps include the padding and border.
export const popoverContentVariants = cva(
  [
    "kl:box-border",
    "kl:inset-auto",
    "kl:overflow-y-auto",
    "kl:[position-anchor:var(--kl-popover-anchor)]",
    "kl:items-start",
    "kl:gap-3",
    "kl:w-max",
    "kl:max-w-[min(20rem,calc(100vw-2rem))]",
    "kl:max-h-[calc(100dvh-2rem)]",
    "kl:m-0",
    "kl:p-4",
    "kl:font-body",
    "kl:text-sm",
    "kl:leading-normal",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-3",
    "kl:rounded-lg",
    "kl:outline-none",
    "kl:scale-95",
    "kl:shadow-md",
    "kl:opacity-0",
    "kl:transition-[opacity,translate,scale,display,overlay]",
    "kl:transition-discrete",
    "kl:duration-150",
    "kl:ease-out",
    "kl:open:flex",
    "kl:open:translate-x-0",
    "kl:open:translate-y-0",
    "kl:open:scale-100",
    "kl:open:opacity-100",
    "kl:open:duration-320",
    "kl:open:ease-bounce",
    "kl:starting:open:scale-95",
    "kl:starting:open:opacity-0",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      // Status tones match Toast's, but stay on the surface: only the outline takes the tone, in
      // its text color, which lightens in dark mode to stand out against the dark surface. The icon
      // carries the full color (toastIconVariants). The offset shadow stays in line either way.
      tone: {
        neutral: ["kl:border-line"],
        success: ["kl:border-success-text"],
        warning: ["kl:border-warning-text"],
        danger: ["kl:border-danger-text"],
        info: ["kl:border-info-text"],
      },
      // Which side of the trigger it opens on, flipping to the opposite side when there's no room.
      // It slides in from the trigger and grows out of the edge facing it. Left and right are the
      // inline start and end, so they swap in right-to-left text.
      side: {
        bottom: [
          "kl:[position-try-fallbacks:flip-block]",
          "kl:my-2",
          "kl:origin-top",
          "kl:-translate-y-1",
          "kl:starting:open:-translate-y-1",
        ],
        top: [
          "kl:[position-try-fallbacks:flip-block]",
          "kl:my-2",
          "kl:origin-bottom",
          "kl:translate-y-1",
          "kl:starting:open:translate-y-1",
        ],
        left: [
          "kl:[position-try-fallbacks:flip-inline]",
          "kl:mx-2",
          "kl:origin-right",
          "kl:translate-x-1",
          "kl:starting:open:translate-x-1",
        ],
        right: [
          "kl:[position-try-fallbacks:flip-inline]",
          "kl:mx-2",
          "kl:origin-left",
          "kl:-translate-x-1",
          "kl:starting:open:-translate-x-1",
        ],
      },
      // Which edge of the trigger it lines up with, or centered on it.
      align: {
        start: [],
        center: [],
        end: [],
      },
    },
    // position-area takes both axes at once, so each side and alignment pairs up here.
    compoundVariants: [
      { side: "bottom", align: "start", class: ["kl:[position-area:block-end_span-inline-end]"] },
      { side: "bottom", align: "center", class: ["kl:[position-area:block-end]"] },
      { side: "bottom", align: "end", class: ["kl:[position-area:block-end_span-inline-start]"] },
      { side: "top", align: "start", class: ["kl:[position-area:block-start_span-inline-end]"] },
      { side: "top", align: "center", class: ["kl:[position-area:block-start]"] },
      { side: "top", align: "end", class: ["kl:[position-area:block-start_span-inline-start]"] },
      { side: "left", align: "start", class: ["kl:[position-area:inline-start_span-block-end]"] },
      { side: "left", align: "center", class: ["kl:[position-area:inline-start]"] },
      { side: "left", align: "end", class: ["kl:[position-area:inline-start_span-block-start]"] },
      { side: "right", align: "start", class: ["kl:[position-area:inline-end_span-block-end]"] },
      { side: "right", align: "center", class: ["kl:[position-area:inline-end]"] },
      { side: "right", align: "end", class: ["kl:[position-area:inline-end_span-block-start]"] },
    ],
    defaultVariants: {
      tone: "neutral",
      side: "bottom",
      align: "start",
    },
  },
);

export type PopoverContentVariantProps = VariantProps<typeof popoverContentVariants>;

// The column that holds the content, beside the icon when there is one.
export const popoverBodyVariants = cva(["kl:flex", "kl:flex-1", "kl:flex-col", "kl:gap-3", "kl:min-w-0"]);
