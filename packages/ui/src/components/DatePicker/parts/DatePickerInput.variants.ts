import { cva, type VariantProps } from "class-variance-authority";

// The input itself is styled by inputVariants; this adds room at its end for the calendar button,
// which sits over that padding.
export const datePickerInputVariants = cva([], {
  variants: {
    size: {
      sm: ["kl:pr-9"],
      md: ["kl:pr-11"],
      lg: ["kl:pr-13"],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type DatePickerInputVariantProps = VariantProps<typeof datePickerInputVariants>;

// The calendar button at the input's end, positioned against the DatePicker wrapper. Unlike
// Combobox's toggle it's in the tab order, as in the APG date picker: it's the keyboard's way into
// the calendar besides Alt+ArrowDown.
export const datePickerToggleVariants = cva(
  [
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
    "kl:rounded-md",
    "kl:cursor-pointer",
    "kl:hover:text-fg-2",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:-outline-offset-4",
    "kl:focus-visible:outline-focus",
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

export type DatePickerToggleVariantProps = VariantProps<typeof datePickerToggleVariants>;
