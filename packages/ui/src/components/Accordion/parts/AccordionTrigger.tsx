import type { KeyboardEvent } from "react";
import { useAccordion, useAccordionItem } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import type { AccordionTriggerProps } from "./AccordionTrigger.types";
import { accordionTriggerIconVariants, accordionTriggerVariants } from "./AccordionTrigger.variants";

// This accordion's enabled triggers, not those of an accordion nested in one of its items.
const TRIGGERS =
  ":scope > [data-slot=accordion-item] > [data-slot=accordion-heading] > [data-slot=accordion-trigger]:not(:disabled)";

/** Moves focus between an accordion's triggers with the arrow keys, Home and End, wrapping at the ends. */
function moveFocus(event: KeyboardEvent<HTMLButtonElement>) {
  const accordion = event.currentTarget.closest("[data-slot=accordion]");
  if (!accordion) return;
  const triggers = [...accordion.querySelectorAll<HTMLButtonElement>(TRIGGERS)];
  const index = triggers.indexOf(event.currentTarget);
  const last = triggers.length - 1;
  const next = {
    ArrowDown: triggers[index === last ? 0 : index + 1],
    ArrowUp: triggers[index <= 0 ? last : index - 1],
    Home: triggers[0],
    End: triggers[last],
  }[event.key];
  if (!next) return;
  event.preventDefault();
  next.focus();
}

/**
 * Heading of an AccordionItem, with a button that expands and collapses it. The heading level
 * comes from the Accordion's `headingLevel`. Props, including `ref` and `className`, go to the button.
 */
export function AccordionTrigger({ className, children, type = "button", onClick, onKeyDown, ...props }: AccordionTriggerProps) {
  const { headingLevel } = useAccordion();
  const item = useAccordionItem();
  const Heading = `h${headingLevel}` as const;
  return (
    <Heading data-slot="accordion-heading" className={cn(["kl:m-0"])}>
      <button
        data-slot="accordion-trigger"
        type={type}
        id={item.triggerId}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        disabled={item.disabled}
        className={cn(accordionTriggerVariants(), className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) item.setOpen(!item.open);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) moveFocus(event);
        }}
        {...props}
      >
        <span className={cn(["kl:flex-1", "kl:min-w-0"])}>{children}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={accordionTriggerIconVariants()}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </Heading>
  );
}
