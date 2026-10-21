import { cva, type VariantProps } from "class-variance-authority";

export const fieldVariants = cva(["kl:group/field"], {
  variants: {
    orientation: {
      // Label, control, then description and error, stacked.
      vertical: ["kl:flex", "kl:flex-col", "kl:gap-1.5"],
      // The control first, with the label beside it and the description and error under the
      // label: for Checkbox and Switch. The control's row centres on the label's first line.
      horizontal: [
        "kl:grid",
        "kl:grid-cols-[auto_1fr]",
        "kl:items-center",
        "kl:gap-x-3",
        "kl:gap-y-1",
        "kl:[&>*:not(:first-child)]:col-start-2",
      ],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type FieldVariantProps = VariantProps<typeof fieldVariants>;
