import { Children, createContext, isValidElement, useContext, type ReactNode, type RefObject } from "react";

/** What a SelectItem tells its Select about itself, so the trigger can show it and point at it. */
export interface SelectItemRecord {
  id: string;
  text: string;
  icon: ReactNode;
  disabled: boolean;
}

/** The highlighted option, and whether the keyboard or the pointer moved there (only the keyboard gets an outline). */
export interface SelectActive {
  value: string;
  source: "keyboard" | "pointer";
}

/** What a Select shares with its trigger, content and items. */
export interface SelectContextValue {
  value: string | null;
  /** Selects a value, calling onValueChange if it changed, and closes the list. */
  select: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  active: SelectActive | null;
  setActive: (active: SelectActive | null) => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  items: ReadonlyMap<string, SelectItemRecord>;
  /** Adds or updates an item, returning a function that removes it. */
  registerItem: (value: string, record: SelectItemRecord) => () => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

/** Returns the enclosing Select's state. Throws outside one, since the parts can't work alone. */
export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select parts must be rendered inside a Select.");
  return context;
}

/** What a SelectGroup shares with its SelectLabel, which names the group. */
export interface SelectGroupContextValue {
  labelId: string;
  /** Called by a SelectLabel as it mounts and unmounts, so the group only points at a label that exists. */
  setHasLabel: (hasLabel: boolean) => void;
}

export const SelectGroupContext = createContext<SelectGroupContextValue | null>(null);

/** Values of the options that can be chosen, in DOM order. Arrow keys and typeahead skip disabled ones. */
export function getOptionValues(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')).map(
    (option) => option.dataset.value!,
  );
}

/** The option to highlight when the list opens: the selected one if it can be chosen, otherwise the first. */
export function getInitialOption(content: HTMLElement, value: string | null, which: "selected" | "first" | "last") {
  const values = getOptionValues(content);
  if (which === "last") return values.at(-1);
  if (which === "selected" && value !== null && values.includes(value)) return value;
  return values[0];
}

/** The plain text inside an item's children, which the trigger shows once it's selected. */
export function getText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return getText(child.props.children);
      return "";
    })
    .join("")
    .trim();
}

/**
 * The trigger's label as text, so the listbox can carry the same name. It reads `aria-labelledby`,
 * then any `<label for>`, then `aria-label`.
 */
export function getTriggerLabel(trigger: HTMLButtonElement) {
  const labelledBy = trigger.getAttribute("aria-labelledby");
  const fromIds = labelledBy
    ?.split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent?.trim())
    .filter(Boolean)
    .join(" ");
  if (fromIds) return fromIds;
  const fromLabels = Array.from(trigger.labels, (label) => label.textContent?.trim())
    .filter(Boolean)
    .join(" ");
  return fromLabels || trigger.getAttribute("aria-label") || undefined;
}
