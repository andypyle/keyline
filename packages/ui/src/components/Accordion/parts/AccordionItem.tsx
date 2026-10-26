import { useAccordion } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import type { AccordionItemProps } from "./AccordionItem.types";
import { accordionItemVariants } from "./AccordionItem.variants";

/**
 * One expandable section of an Accordion. Renders a `<details>`; put an AccordionTrigger first,
 * then an AccordionContent. In an `exclusive` Accordion it takes the accordion's `name`, so
 * opening it closes its siblings; pass your own `name` to group items differently.
 */
export function AccordionItem({ className, name, ...props }: AccordionItemProps) {
  const accordion = useAccordion();
  return (
    <details
      data-slot="accordion-item"
      name={name ?? accordion?.name}
      className={cn(accordionItemVariants(), className)}
      {...props}
    />
  );
}
