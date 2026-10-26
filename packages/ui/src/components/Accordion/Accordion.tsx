import { useId, useMemo } from "react";
import { AccordionContext } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import type { AccordionProps } from "./Accordion.types";
import { accordionVariants } from "./Accordion.variants";

/**
 * Stacks sections of content that each expand and collapse. Compose it from AccordionItems, each
 * holding an AccordionTrigger and then an AccordionContent.
 *
 * Every item is a native `<details>` with a `<summary>` trigger, so the browser handles the
 * keyboard, announces the expanded state, and opens a closed item when find-in-page matches text
 * inside it. Items open independently unless the accordion is `exclusive`.
 */
export function Accordion({ className, flat, exclusive, ...props }: AccordionProps) {
  const id = useId();
  const context = useMemo(() => ({ name: exclusive ? `kl-accordion-${id}` : undefined }), [exclusive, id]);
  return (
    <AccordionContext value={context}>
      <div data-slot="accordion" className={cn(accordionVariants({ flat }), className)} {...props} />
    </AccordionContext>
  );
}
