import { cva, type VariantProps } from "class-variance-authority";

// The content is a native <dialog> opened with showModal(): it renders in the top layer, centered
// by the browser's own dialog styles, over a ::backdrop. The browser hides a closed dialog with
// display: none, so display is only set while open, and transition-discrete keeps the fade
// running through the switch and out of the top layer (overlay).
//
// Like DropdownMenuContent, opening fades and grows the panel on ease-bounce, so it overshoots a
// touch and settles; closing takes the base timing, a quicker ease-out with no bounce. The
// backdrop tints and slightly blurs the page, and only fades: its opacity carries the blur in and
// out with the tint.
//
// A tall panel keeps 3rem clear above and below, so it never meets the viewport's edges; the
// sides keep a narrower 1rem. Keyline ships without a CSS reset, so box-border is what makes those
// sizes include the panel's padding and border.
export const modalContentVariants = cva(
  [
    "kl:box-border",
    "kl:relative",
    "kl:overflow-y-auto",
    "kl:overscroll-contain",
    "kl:flex-col",
    "kl:gap-3",
    "kl:w-[calc(100%-2rem)]",
    "kl:max-h-[calc(100dvh-6rem)]",
    "kl:p-6",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-xl",
    "kl:translate-y-2",
    "kl:scale-95",
    "kl:shadow-xl",
    "kl:opacity-0",
    "kl:transition-[opacity,translate,scale,display,overlay]",
    "kl:transition-discrete",
    "kl:duration-150",
    "kl:ease-out",
    "kl:backdrop:bg-overlay",
    "kl:backdrop:opacity-0",
    "kl:backdrop:backdrop-blur-xs",
    "kl:backdrop:transition-[opacity,display,overlay]",
    "kl:backdrop:transition-discrete",
    "kl:backdrop:duration-150",
    "kl:backdrop:ease-out",
    "kl:open:flex",
    "kl:open:translate-y-0",
    "kl:open:scale-100",
    "kl:open:opacity-100",
    "kl:open:duration-320",
    "kl:open:ease-bounce",
    "kl:open:backdrop:opacity-100",
    "kl:open:backdrop:duration-200",
    "kl:starting:open:translate-y-2",
    "kl:starting:open:scale-95",
    "kl:starting:open:opacity-0",
    "kl:starting:open:backdrop:opacity-0",
    "kl:motion-reduce:transition-none",
    "kl:motion-reduce:backdrop:transition-none",
  ],
  {
    variants: {
      // The panel's widest; it narrows to fit small screens.
      size: {
        sm: ["kl:max-w-sm"],
        md: ["kl:max-w-lg"],
        lg: ["kl:max-w-2xl"],
      },
      // ModalTitle pads its end by --kl-modal-title-inset, so a long title stays clear of the
      // corner close button: the 40px button reaches 32px past the panel's padding, plus a gap.
      /** Leaves out the corner close button. Escape and a click on the backdrop still close the modal. */
      noCloseButton: {
        true: [],
        false: ["kl:[--kl-modal-title-inset:--spacing(11)]"],
      },
    },
    defaultVariants: {
      size: "md",
      noCloseButton: false,
    },
  },
);

export type ModalContentVariantProps = VariantProps<typeof modalContentVariants>;
