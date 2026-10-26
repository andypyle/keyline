import { createContext, useContext, type RefObject } from "react";

/** What a Popover shares with its trigger, content and close buttons. */
export interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

/** Returns the enclosing Popover's state. Throws outside one, since the parts can't work alone. */
export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover parts must be rendered inside a Popover.");
  return context;
}

const TABBABLE = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled):not([type=hidden])",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

/** The first element in the popover that Tab would reach, if there is one. */
export function getFirstTabbable(content: HTMLElement) {
  return content.querySelector<HTMLElement>(TABBABLE);
}
