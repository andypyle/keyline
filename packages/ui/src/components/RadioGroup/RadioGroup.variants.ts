import { cva, type VariantProps } from "class-variance-authority";

export const radioGroupVariants = cva(["kl:flex"], {
  variants: {
    orientation: {
      vertical: ["kl:flex-col", "kl:gap-3"],
      // Wraps onto more rows when the choices don't fit across.
      horizontal: ["kl:flex-row", "kl:flex-wrap", "kl:gap-x-6", "kl:gap-y-3"],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>;
