import type { ComponentPropsWithRef } from "react";
import type { AccordionVariantProps } from "./Accordion.variants";

export interface AccordionProps extends ComponentPropsWithRef<"div">, AccordionVariantProps {
  /**
   * Keeps at most one AccordionItem open: opening one closes the one that was open. The items
   * share a native `<details name>`, so the browser does this, even before React hydrates.
   */
  exclusive?: boolean;
}
