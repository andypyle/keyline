import { useId, useMemo } from "react";
import { AccordionItemContext, useAccordion } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import type { AccordionItemProps } from "./AccordionItem.types";
import { accordionItemVariants } from "./AccordionItem.variants";

/**
 * One expandable section of an Accordion. Put an AccordionTrigger first, then an AccordionContent.
 * It's open when its `value` is in the Accordion's open values; `disabled` locks it as it is.
 */
export function AccordionItem({ className, value: valueProp, disabled = false, ...props }: AccordionItemProps) {
  const accordion = useAccordion();
  const id = useId();
  const value = valueProp ?? id;
  const open = accordion.value.includes(value);

  const context = useMemo(
    () => ({
      open,
      disabled,
      setOpen: (next: boolean) => accordion.setItemOpen(value, next),
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
    }),
    [open, disabled, accordion, value, id],
  );

  return (
    <AccordionItemContext value={context}>
      <div
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(accordionItemVariants(), className)}
        {...props}
      />
    </AccordionItemContext>
  );
}
