import { cva, type VariantProps } from "class-variance-authority";

// A native checkbox with its look cleared, so labels, forms, Space and :indeterminate all work as
// usual. The check and dash are separate overlays (an input can't hold children), stacked on the
// same grid cell and shown through the input's state with peer-*.
export const checkboxVariants = cva(
  [
    "kl:peer",
    "kl:box-border",
    "kl:[grid-area:1/1]",
    "kl:shrink-0",
    "kl:m-0",
    "kl:bg-surface",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-sm",
    "kl:shadow-sm",
    "kl:appearance-none",
    "kl:transition-colors",
    "kl:duration-120",
    "kl:ease-out",
    "kl:cursor-pointer",
    "kl:enabled:hover:bg-surface-hover",
    "kl:checked:bg-accent",
    "kl:indeterminate:bg-accent",
    "kl:enabled:checked:hover:bg-accent-hover",
    "kl:enabled:indeterminate:hover:bg-accent-hover",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-2",
    "kl:focus-visible:outline-focus",
    "kl:aria-invalid:border-danger",
    "kl:disabled:cursor-not-allowed",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:size-4"],
        md: ["kl:size-5"],
        lg: ["kl:size-6"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type CheckboxVariantProps = VariantProps<typeof checkboxVariants>;

// The check and the dash. Each pops in on ease-bounce when its state applies. A checkbox that's
// both checked and indeterminate shows the dash, as browsers do.
export const checkboxIndicatorVariants = cva(
  [
    "kl:[grid-area:1/1]",
    "kl:place-self-center",
    "kl:text-on-fill",
    "kl:scale-50",
    "kl:opacity-0",
    "kl:transition-[scale,opacity]",
    "kl:duration-200",
    "kl:ease-bounce",
    "kl:pointer-events-none",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:size-3"],
        md: ["kl:size-3.5"],
        lg: ["kl:size-4.5"],
      },
      kind: {
        check: ["kl:peer-[:checked:not(:indeterminate)]:scale-100", "kl:peer-[:checked:not(:indeterminate)]:opacity-100"],
        dash: ["kl:peer-indeterminate:scale-100", "kl:peer-indeterminate:opacity-100"],
      },
    },
    defaultVariants: {
      size: "md",
      kind: "check",
    },
  },
);

export type CheckboxIndicatorVariantProps = VariantProps<typeof checkboxIndicatorVariants>;
