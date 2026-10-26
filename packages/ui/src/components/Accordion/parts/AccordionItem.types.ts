import type { ComponentPropsWithRef } from "react";

export interface AccordionItemProps extends ComponentPropsWithRef<"div"> {
  /** Identifies the item in the Accordion's `value` and `defaultValue`. Defaults to a generated id. */
  value?: string;
  /** Keeps the item from opening or closing, and takes its trigger out of the Tab order. */
  disabled?: boolean;
}
