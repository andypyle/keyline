import { cva, type VariantProps } from "class-variance-authority";

// The outline and shadow wrap the whole stack; AccordionItems draw the rules between themselves.
// It clips to its corners so the first and last AccordionTrigger's hover fill stays inside them.
export const accordionVariants = cva(
  [
    "kl:flex",
    "kl:flex-col",
    "kl:overflow-clip",
    "kl:min-w-0",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-lg",
  ],
  {
    variants: {
      /** Removes the shadow, keeping the outline. */
      flat: {
        true: [],
        false: ["kl:shadow-lg"],
      },
    },
    defaultVariants: {
      flat: false,
    },
  },
);

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;
