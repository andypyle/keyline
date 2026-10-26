import { cva, type VariantProps } from "class-variance-authority";

// The focus outline sits inside the trigger, since the Accordion clips its corners.
export const accordionTriggerVariants = cva([
  "kl:group/accordion-trigger",
  "kl:flex",
  "kl:items-center",
  "kl:gap-4",
  "kl:w-full",
  // Keyline ships without a CSS reset, so clear the browser's default button spacing.
  "kl:m-0",
  "kl:px-5",
  "kl:py-4",
  "kl:font-display",
  "kl:font-medium",
  "kl:text-lg",
  "kl:leading-snug",
  "kl:text-left",
  "kl:bg-transparent",
  "kl:text-fg-1",
  "kl:border-0",
  "kl:transition-colors",
  "kl:duration-120",
  "kl:ease-out",
  "kl:cursor-pointer",
  "kl:select-none",
  "kl:enabled:hover:bg-surface-hover",
  "kl:focus-visible:outline-3",
  "kl:focus-visible:-outline-offset-3",
  "kl:focus-visible:outline-focus",
  "kl:disabled:opacity-45",
  "kl:disabled:cursor-not-allowed",
  "kl:motion-reduce:transition-none",
]);

// Turns over while its trigger is expanded.
export const accordionTriggerIconVariants = cva([
  "kl:shrink-0",
  "kl:size-5",
  "kl:transition-transform",
  "kl:duration-320",
  "kl:ease-bounce",
  "kl:pointer-events-none",
  "kl:group-aria-expanded/accordion-trigger:rotate-180",
  "kl:motion-reduce:transition-none",
]);

export type AccordionTriggerVariantProps = VariantProps<typeof accordionTriggerVariants>;
