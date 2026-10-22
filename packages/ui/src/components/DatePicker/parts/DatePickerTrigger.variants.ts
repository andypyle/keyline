import { cva, type VariantProps } from "class-variance-authority";

// Looks like SelectTrigger, and so like an Input, with the same sizes, borders and invalid state.
export const datePickerTriggerVariants = cva(
  [
    "kl:group/date-picker-trigger",
    "kl:flex",
    "kl:items-center",
    "kl:justify-between",
    "kl:gap-2",
    "kl:w-full",
    "kl:min-w-0",
    // Keyline ships without a CSS reset, so clear the browser's default button spacing.
    "kl:m-0",
    "kl:font-body",
    "kl:leading-none",
    "kl:text-left",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-line",
    "kl:transition-colors",
    "kl:duration-120",
    "kl:ease-out",
    "kl:cursor-pointer",
    "kl:select-none",
    "kl:enabled:hover:bg-surface-hover",
    "kl:enabled:aria-expanded:bg-surface-hover",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-2",
    "kl:focus-visible:outline-focus",
    "kl:aria-invalid:border-danger",
    "kl:disabled:opacity-45",
    "kl:disabled:cursor-not-allowed",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:shrink-0",
    "kl:[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:h-9", "kl:px-3", "kl:text-sm", "kl:border-2", "kl:[&_svg]:size-4"],
        md: ["kl:h-11.5", "kl:px-4", "kl:text-base", "kl:border-3", "kl:[&_svg]:size-4.5"],
        lg: ["kl:h-14.5", "kl:px-5", "kl:text-lg", "kl:border-3", "kl:[&_svg]:size-5"],
      },
      radius: {
        full: ["kl:rounded-full"],
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
    },
    defaultVariants: {
      size: "md",
      radius: "md",
    },
  },
);

export type DatePickerTriggerVariantProps = VariantProps<typeof datePickerTriggerVariants>;
