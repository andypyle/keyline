import { cva, type VariantProps } from "class-variance-authority";

// Shares SelectContent's look and motion: a manual popover in the top layer, tethered to the
// Combobox by its anchor name (so it can't reuse selectContentVariants, which names the Select's),
// flipping above the input when there's no room below. It's at least as wide as the input, and long
// lists cap at 20rem (less on short viewports) and scroll. The browser hides closed popovers with
// display: none, so display is only set while open, and transition-discrete keeps the fade
// running through the switch.
//
// The listbox inside is what scrolls, not the popover: axe requires a scrolling region to be
// keyboard-reachable, and the listbox is, through the input's arrow keys.
//
// Keyline ships without a CSS reset, so box-border is what makes the max height include the
// popover's padding and border.
export const comboboxContentVariants = cva(
  [
    "kl:box-border",
    "kl:inset-auto",
    "kl:[position-anchor:var(--kl-combobox-anchor)]",
    "kl:[position-try-fallbacks:flip-block]",
    "kl:flex-col",
    "kl:min-w-[anchor-size(width)]",
    "kl:max-h-[min(20rem,calc(100dvh-2rem))]",
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
      // Which edge of the input the list lines up with when it's wider than the input.
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

export type ComboboxContentVariantProps = VariantProps<typeof comboboxContentVariants>;
