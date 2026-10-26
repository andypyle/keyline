import { cva, type VariantProps } from "class-variance-authority";
import { placementCompoundVariants } from "@/lib/anchor-placement";

// A small label in Keyline's overlay look, one step lighter than PopoverContent's: the surface with
// a 2px line outline and a small hard offset shadow. It's a manual popover in the top layer,
// tethered to the Tooltip by its anchor name, like PopoverContent. The browser hides closed popovers with display: none, so display is
// only set while open, and transition-discrete keeps the fade running through the switch. It fades
// and grows out of the trigger quickly, without Popover's bounce, since it comes and goes often.
//
// It sizes to its text up to a readable width. Keyline ships without a CSS reset, so box-border is
// what makes the cap include the padding and border.
export const tooltipContentVariants = cva(
  [
    "kl:box-border",
    "kl:inset-auto",
    "kl:[position-anchor:var(--kl-tooltip-anchor)]",
    "kl:w-max",
    "kl:max-w-[min(16rem,calc(100vw-2rem))]",
    "kl:m-0",
    "kl:px-2.5",
    "kl:py-1.5",
    "kl:font-body",
    "kl:font-semibold",
    "kl:text-sm",
    "kl:leading-snug",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-md",
    "kl:scale-95",
    "kl:shadow-sm",
    "kl:opacity-0",
    "kl:transition-[opacity,translate,scale,display,overlay]",
    "kl:transition-discrete",
    "kl:duration-100",
    "kl:ease-out",
    "kl:open:block",
    "kl:open:translate-x-0",
    "kl:open:translate-y-0",
    "kl:open:scale-100",
    "kl:open:opacity-100",
    "kl:open:duration-150",
    "kl:starting:open:scale-95",
    "kl:starting:open:opacity-0",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      // Which side of the trigger it shows on, flipping to the opposite side when there's no room.
      // It slides in from the trigger and grows out of the edge facing it. Left and right are the
      // inline start and end, so they swap in right-to-left text.
      side: {
        top: [
          "kl:[position-try-fallbacks:flip-block]",
          "kl:my-1.5",
          "kl:origin-bottom",
          "kl:translate-y-0.5",
          "kl:starting:open:translate-y-0.5",
        ],
        bottom: [
          "kl:[position-try-fallbacks:flip-block]",
          "kl:my-1.5",
          "kl:origin-top",
          "kl:-translate-y-0.5",
          "kl:starting:open:-translate-y-0.5",
        ],
        left: [
          "kl:[position-try-fallbacks:flip-inline]",
          "kl:mx-1.5",
          "kl:origin-right",
          "kl:translate-x-0.5",
          "kl:starting:open:translate-x-0.5",
        ],
        right: [
          "kl:[position-try-fallbacks:flip-inline]",
          "kl:mx-1.5",
          "kl:origin-left",
          "kl:-translate-x-0.5",
          "kl:starting:open:-translate-x-0.5",
        ],
      },
      // Which edge of the trigger it lines up with, or centered on it.
      align: {
        start: [],
        center: [],
        end: [],
      },
    },
    compoundVariants: placementCompoundVariants,
    defaultVariants: {
      side: "top",
      align: "center",
    },
  },
);

export type TooltipContentVariantProps = VariantProps<typeof tooltipContentVariants>;
