import { useMemo, useState } from "react";
import { AccordionContext } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import type { AccordionProps } from "./Accordion.types";
import { accordionVariants } from "./Accordion.variants";

/**
 * Stacks sections of content that each expand and collapse. Compose it from AccordionItems, each
 * holding an AccordionTrigger and then an AccordionContent.
 *
 * Each trigger is a button inside a heading (`headingLevel`, an `<h3>` by default), so screen
 * reader users can move between sections by heading as well as by Tab. The arrow keys, Home and
 * End move focus between triggers. Items open independently unless the accordion is `exclusive`.
 * Give each item a `value` to open it from `defaultValue`, or to control the open items with
 * `value` and `onValueChange`.
 *
 * Opening and closing animate the content's height in every current browser, and not at all with
 * reduced motion. Closed content stays in the page, so in browsers that support
 * `hidden="until-found"`, find-in-page still finds it and opens its item.
 */
export function Accordion({
  className,
  flat,
  exclusive,
  value: valueProp,
  defaultValue,
  onValueChange,
  headingLevel = 3,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolledValue;

  const context = useMemo(
    () => ({
      value,
      headingLevel,
      setItemOpen: (item: string, open: boolean) => {
        if (open === value.includes(item)) return;
        const next = !open ? value.filter((v) => v !== item) : exclusive ? [item] : [...value, item];
        if (!controlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
    }),
    [value, headingLevel, exclusive, controlled, onValueChange],
  );

  return (
    <AccordionContext value={context}>
      <div data-slot="accordion" className={cn(accordionVariants({ flat }), className)} {...props} />
    </AccordionContext>
  );
}
