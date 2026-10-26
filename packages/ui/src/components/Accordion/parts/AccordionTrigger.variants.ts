import { cva, type VariantProps } from "class-variance-authority";

// list-none removes the disclosure triangle in Chrome and Firefox; Safari still draws it through
// ::-webkit-details-marker. The focus outline sits inside the trigger, since the Accordion clips.
export const accordionTriggerVariants = cva([
  "kl:flex",
  "kl:list-none",
  "kl:items-center",
  "kl:gap-4",
  "kl:px-5",
  "kl:py-4",
  "kl:font-display",
  "kl:font-medium",
  "kl:text-lg",
  "kl:leading-snug",
  "kl:text-fg-1",
  "kl:transition-colors",
  "kl:duration-120",
  "kl:ease-out",
  "kl:cursor-pointer",
  "kl:select-none",
  "kl:hover:bg-surface-hover",
  "kl:focus-visible:outline-3",
  "kl:focus-visible:-outline-offset-3",
  "kl:focus-visible:outline-focus",
  "kl:motion-reduce:transition-none",
  "kl:[&::-webkit-details-marker]:hidden",
]);

// Turns over when its own item is open, not when any enclosing item is, so nested accordions
// each point their own way.
export const accordionTriggerIconVariants = cva([
  "kl:shrink-0",
  "kl:size-5",
  "kl:transition-transform",
  "kl:duration-320",
  "kl:ease-bounce",
  "kl:pointer-events-none",
  "kl:motion-reduce:transition-none",
  "kl:[[open]>summary>&]:rotate-180",
]);

export type AccordionTriggerVariantProps = VariantProps<typeof accordionTriggerVariants>;
