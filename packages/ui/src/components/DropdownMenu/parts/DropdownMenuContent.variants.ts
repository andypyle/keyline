import { cva, type VariantProps } from "class-variance-authority";

// The content is a manual popover: it renders in the top layer, so no overflow or stacking context
// can clip it, and the anchor name the DropdownMenu sets ties it to the trigger. It flips above the
// trigger when there's no room below. The browser hides closed popovers with display: none, so
// display is only set while open, and transition-discrete keeps the fade running through the switch.
//
// Opening grows the menu out of the trigger's corner on ease-bounce, so it overshoots a touch and
// settles; closing takes the base timing, a quicker ease-out with no bounce.
export const dropdownMenuContentVariants = cva(
  [
    "kl:inset-auto",
    "kl:overflow-y-auto",
    "kl:[position-anchor:var(--kl-dropdown-menu-anchor)]",
    "kl:[position-try-fallbacks:flip-block]",
    "kl:flex-col",
    "kl:gap-0.5",
    "kl:min-w-[max(12rem,anchor-size(width))]",
    "kl:max-h-[calc(100dvh-2rem)]",
    "kl:m-0",
    "kl:my-2",
    "kl:p-1.5",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-lg",
    "kl:-translate-y-1",
    "kl:scale-95",
    "kl:shadow-md",
    "kl:opacity-0",
    "kl:transition-[opacity,translate,scale,display,overlay]",
    "kl:transition-discrete",
    "kl:duration-150",
    "kl:ease-out",
    "kl:open:flex",
    "kl:open:translate-y-0",
    "kl:open:scale-100",
    "kl:open:opacity-100",
    "kl:open:duration-320",
    "kl:open:ease-bounce",
    "kl:starting:open:-translate-y-1",
    "kl:starting:open:scale-95",
    "kl:starting:open:opacity-0",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      // Which edge of the trigger the menu lines up with; it grows away from that edge.
      align: {
        start: ["kl:origin-top-left", "kl:[position-area:block-end_span-inline-end]"],
        end: ["kl:origin-top-right", "kl:[position-area:block-end_span-inline-start]"],
      },
    },
    defaultVariants: {
      align: "start",
    },
  },
);

export type DropdownMenuContentVariantProps = VariantProps<typeof dropdownMenuContentVariants>;
