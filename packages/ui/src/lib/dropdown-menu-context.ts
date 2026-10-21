import { createContext, useContext, type RefObject } from "react";

/** What a DropdownMenu shares with its trigger, content and items. */
export interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  /** Which item takes focus the next time the menu opens: ArrowUp on the trigger opens onto the last. */
  focusOnOpen: RefObject<"first" | "last">;
}

export const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

/** Returns the enclosing DropdownMenu's state. Throws outside one, since the parts can't work alone. */
export function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenu parts must be rendered inside a DropdownMenu.");
  return context;
}

/** The menu's items in DOM order, disabled ones included: they stay focusable so they can be discovered. */
export function getMenuItems(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}
