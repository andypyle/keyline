import { cva, type VariantProps } from "class-variance-authority";

// A 2px rule in `line` separates each item from the one above, like a Table's rows.
export const accordionItemVariants = cva(["kl:border-line", "kl:not-first:border-t-2"]);

export type AccordionItemVariantProps = VariantProps<typeof accordionItemVariants>;
