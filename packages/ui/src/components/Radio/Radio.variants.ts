import { cva, type VariantProps } from "class-variance-authority";

// A native radio with its look cleared, matching Checkbox: same sizes, border, shadow and states,
// round. The dot is a separate overlay (an input can't hold children) on the same grid cell, shown
// through the input's state with peer-checked.
export const radioVariants = cva(
  [
    "kl:peer",
    "kl:box-border",
    "kl:[grid-area:1/1]",
    "kl:shrink-0",
    "kl:m-0",
    "kl:bg-surface",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-full",
    "kl:shadow-sm",
    "kl:appearance-none",
    "kl:transition-colors",
    "kl:duration-120",
    "kl:ease-out",
    "kl:cursor-pointer",
    "kl:enabled:hover:bg-surface-hover",
    "kl:checked:bg-control",
    "kl:enabled:checked:hover:bg-control-hover",
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

export type RadioVariantProps = VariantProps<typeof radioVariants>;

// The dot, which pops in on ease-bounce once the radio is checked.
export const radioIndicatorVariants = cva(
  [
    "kl:[grid-area:1/1]",
    "kl:place-self-center",
    "kl:bg-on-control",
    "kl:rounded-full",
    "kl:scale-0",
    "kl:transition-[scale]",
    "kl:duration-200",
    "kl:ease-bounce",
    "kl:pointer-events-none",
    "kl:peer-checked:scale-100",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:size-1.5"],
        md: ["kl:size-2"],
        lg: ["kl:size-2.5"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type RadioIndicatorVariantProps = VariantProps<typeof radioIndicatorVariants>;
