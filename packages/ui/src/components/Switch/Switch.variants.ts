import { cva, type VariantProps } from "class-variance-authority";

// A native checkbox with role="switch" and its look cleared, so labels, forms and Space work as
// usual. The input is the track; the thumb is an overlay (an input can't hold children) on the
// same grid cell, sliding across through peer-checked. Off, the track is sunken; on, it fills
// with the accent, as Checkbox does.
export const switchVariants = cva(
  [
    "kl:peer",
    "kl:box-border",
    "kl:[grid-area:1/1]",
    "kl:shrink-0",
    "kl:m-0",
    "kl:bg-sunken",
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
    "kl:checked:bg-accent",
    "kl:enabled:checked:hover:bg-accent-hover",
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
        sm: ["kl:w-8", "kl:h-5"],
        md: ["kl:w-10", "kl:h-6"],
        lg: ["kl:w-12", "kl:h-7"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type SwitchVariantProps = VariantProps<typeof switchVariants>;

// The thumb keeps a 4px inset from the track's outer edge on every side (2px border, 2px gap),
// so switching on moves it by the track's width less the thumb and both insets.
export const switchThumbVariants = cva(
  [
    "kl:box-border",
    "kl:[grid-area:1/1]",
    "kl:place-self-center",
    "kl:justify-self-start",
    "kl:ml-1",
    "kl:bg-surface",
    "kl:border-2",
    "kl:border-line",
    "kl:rounded-full",
    "kl:transition-[translate]",
    "kl:duration-200",
    "kl:ease-bounce",
    "kl:pointer-events-none",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: ["kl:size-3", "kl:peer-checked:translate-x-3"],
        md: ["kl:size-4", "kl:peer-checked:translate-x-4"],
        lg: ["kl:size-5", "kl:peer-checked:translate-x-5"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type SwitchThumbVariantProps = VariantProps<typeof switchThumbVariants>;
