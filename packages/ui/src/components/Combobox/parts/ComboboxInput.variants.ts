import { cva, type VariantProps } from "class-variance-authority";

// The input itself is styled by inputVariants; these add room at its end for the toggle button,
// and at its start for the selected option's icon, which sit over that padding.
export const comboboxInputVariants = cva([], {
  variants: {
    size: {
      sm: ["kl:pr-9"],
      md: ["kl:pr-11"],
      lg: ["kl:pr-13"],
    },
    withIcon: {
      true: [],
      false: [],
    },
  },
  compoundVariants: [
    { size: "sm", withIcon: true, class: ["kl:pl-9"] },
    { size: "md", withIcon: true, class: ["kl:pl-11"] },
    { size: "lg", withIcon: true, class: ["kl:pl-13"] },
  ],
  defaultVariants: {
    size: "md",
    withIcon: false,
  },
});

export type ComboboxInputVariantProps = VariantProps<typeof comboboxInputVariants>;

// The chevron button at the input's end, positioned against the Combobox wrapper. It's out of the
// tab order, like the APG example's: the keyboard opens the list from the input itself.
export const comboboxToggleVariants = cva(
  [
    "kl:group/combobox-toggle",
    "kl:absolute",
    "kl:inset-y-0",
    "kl:right-0",
    "kl:flex",
    "kl:items-center",
    "kl:justify-center",
    // Keyline ships without a CSS reset, so clear the browser's default button spacing.
    "kl:m-0",
    "kl:p-0",
    "kl:bg-transparent",
    "kl:text-fg-1",
    "kl:border-0",
    "kl:cursor-pointer",
    "kl:disabled:opacity-45",
    "kl:disabled:cursor-not-allowed",
    "kl:[&_svg]:shrink-0",
    "kl:[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:w-9", "kl:[&_svg]:size-4"],
        md: ["kl:w-11", "kl:[&_svg]:size-4.5"],
        lg: ["kl:w-13", "kl:[&_svg]:size-5"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type ComboboxToggleVariantProps = VariantProps<typeof comboboxToggleVariants>;

// The selected option's icon at the input's start. Clicks pass through to the input. It dims
// while the text has been edited away from the selection, rather than disappearing, so the text
// doesn't shift while typing and the current selection stays visible.
export const comboboxIconVariants = cva(
  [
    "kl:absolute",
    "kl:inset-y-0",
    "kl:left-0",
    "kl:flex",
    "kl:items-center",
    "kl:justify-center",
    "kl:text-fg-1",
    "kl:transition-opacity",
    "kl:duration-120",
    "kl:ease-out",
    "kl:pointer-events-none",
    "kl:data-stale:opacity-45",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        sm: ["kl:w-9", "kl:[&_svg]:size-4"],
        md: ["kl:w-11", "kl:[&_svg]:size-4.5"],
        lg: ["kl:w-13", "kl:[&_svg]:size-5"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type ComboboxIconVariantProps = VariantProps<typeof comboboxIconVariants>;
