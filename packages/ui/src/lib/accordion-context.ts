import { createContext, useContext } from "react";

export interface AccordionContextValue {
  /** The `name` every AccordionItem's `<details>` shares in an `exclusive` Accordion, or undefined. */
  name: string | undefined;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

/** Returns what the enclosing Accordion provides, or null outside one. */
export function useAccordion() {
  return useContext(AccordionContext);
}
