import { cn } from "@/lib/cn";
import type { AccordionTriggerProps } from "./AccordionTrigger.types";
import { accordionTriggerIconVariants, accordionTriggerVariants } from "./AccordionTrigger.variants";

/**
 * Heading of an AccordionItem that expands and collapses it. Renders a `<summary>`, which the
 * browser makes focusable, toggles with Enter and Space, and announces as expanded or collapsed.
 * Keep its content to text and icons: a summary's content isn't announced as headings or links.
 */
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <summary data-slot="accordion-trigger" className={cn(accordionTriggerVariants(), className)} {...props}>
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
    </summary>
  );
}
