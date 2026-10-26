import { createContext, useContext } from "react";
import type { AccordionHeadingLevel } from "@/components/Accordion/Accordion.types";

export interface AccordionContextValue {
  /** The values of the open AccordionItems. */
  value: string[];
  /** Opens or closes one item. In an `exclusive` Accordion, opening one closes the rest. */
  setItemOpen: (item: string, open: boolean) => void;
  /** The heading element each AccordionTrigger renders around its button. */
  headingLevel: AccordionHeadingLevel;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

/** Returns what the enclosing Accordion provides. */
export function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be rendered inside an Accordion.");
  return context;
}

export interface AccordionItemContextValue {
  open: boolean;
  disabled: boolean;
  setOpen: (open: boolean) => void;
  /** Ids that tie the trigger and the content to each other for assistive technology. */
  triggerId: string;
  contentId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/** Returns what the enclosing AccordionItem provides. */
export function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("AccordionTrigger and AccordionContent must be rendered inside an AccordionItem.");
  return context;
}
