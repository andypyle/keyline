import { createContext, useContext, type RefObject } from "react";
import type { ListboxActive, ListboxItemRecord } from "./listbox";

/** What a Select shares with its trigger, content and items. */
export interface SelectContextValue {
  value: string | null;
  /** Selects a value, calling onValueChange if it changed, and closes the list. */
  select: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  active: ListboxActive | null;
  setActive: (active: ListboxActive | null) => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  items: ReadonlyMap<string, ListboxItemRecord>;
  /** Adds or updates an item, returning a function that removes it. */
  registerItem: (value: string, record: ListboxItemRecord) => () => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

/** Returns the enclosing Select's state. Throws outside one, since the parts can't work alone. */
export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select parts must be rendered inside a Select.");
  return context;
}
