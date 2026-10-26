import type { ComponentPropsWithRef } from "react";

export interface AccordionItemProps extends ComponentPropsWithRef<"details"> {
  /**
   * Opens the item. As on a native `<details>`, it's applied when it changes, and the reader can
   * still toggle the item. To control it, keep it in state and update it from `onToggle`, reading
   * `event.currentTarget.open`.
   */
  open?: boolean;
}
