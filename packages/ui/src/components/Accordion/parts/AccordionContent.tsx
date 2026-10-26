import { cn } from "@/lib/cn";
import type { AccordionContentProps } from "./AccordionContent.types";

/** Content of an AccordionItem, shown while it's open. Put it after the AccordionTrigger. */
export function AccordionContent({ className, ...props }: AccordionContentProps) {
  // The top padding keeps the text off the trigger's hover fill, which still shows just after a click opens the item.
  return (
    <div
      data-slot="accordion-content"
      className={cn(["kl:px-5", "kl:pt-1", "kl:pb-5", "kl:text-base", "kl:leading-body", "kl:text-fg-2"], className)}
      {...props}
    />
  );
}
