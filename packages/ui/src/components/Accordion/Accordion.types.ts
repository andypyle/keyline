import type { ComponentPropsWithRef } from "react";
import type { AccordionVariantProps } from "./Accordion.variants";

/** The heading level of each AccordionTrigger: `3` renders an `<h3>`. */
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue">, AccordionVariantProps {
  /** Keeps at most one AccordionItem open: opening one closes the one that was open. */
  exclusive?: boolean;
  /** The values of the open AccordionItems, to control them. Pair it with `onValueChange`. */
  value?: string[];
  /** The values of the AccordionItems open at first, when uncontrolled. */
  defaultValue?: string[];
  /** Called with the new open values whenever an item opens or closes. */
  onValueChange?: (value: string[]) => void;
  /**
   * The heading level that wraps each AccordionTrigger, so screen reader users can move between
   * sections by heading. Pick the level below the heading the accordion sits under. Defaults to 3.
   */
  headingLevel?: AccordionHeadingLevel;
}
