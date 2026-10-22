import { Children, createContext, isValidElement, useCallback, useState, type ReactNode } from "react";

// Shared by the components that pop up a listbox of options: Select and Combobox. Focus stays on
// their control while options are highlighted through aria-activedescendant.

/** What an option tells its parent about itself, so the control can show it and point at it. */
export interface ListboxItemRecord {
  id: string;
  text: string;
  icon: ReactNode;
  disabled: boolean;
}

/** The highlighted option, and whether the keyboard or the pointer moved there (only the keyboard gets an outline). */
export interface ListboxActive {
  value: string;
  source: "keyboard" | "pointer";
}

/**
 * The options' records, keyed by value. Options register on mount and whenever their text or state
 * changes, returning a function that removes them. Updates that change nothing keep the same map,
 * so they don't re-render the parent.
 */
export function useItemRegistry() {
  const [items, setItems] = useState<ReadonlyMap<string, ListboxItemRecord>>(() => new Map());

  const registerItem = useCallback((value: string, record: ListboxItemRecord) => {
    setItems((prev) => {
      const current = prev.get(value);
      const same =
        current?.id === record.id &&
        current.text === record.text &&
        current.icon === record.icon &&
        current.disabled === record.disabled;
      return same ? prev : new Map(prev).set(value, record);
    });
    return () => {
      setItems((prev) => {
        if (prev.get(value)?.id !== record.id) return prev;
        const next = new Map(prev);
        next.delete(value);
        return next;
      });
    };
  }, []);

  return [items, registerItem] as const;
}

/** What a group of options (SelectGroup, ComboboxGroup) shares with its label, which names the group. */
export interface ListboxGroupContextValue {
  labelId: string;
  /** Called by the label as it mounts and unmounts, so the group only points at a label that exists. */
  setHasLabel: (hasLabel: boolean) => void;
}

export const ListboxGroupContext = createContext<ListboxGroupContextValue | null>(null);

/** Values of the options that can be highlighted, in DOM order: not disabled, and not filtered out. */
export function getOptionValues(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"]):not([hidden])'),
    (option) => option.dataset.value!,
  );
}

/** The option to highlight when the list opens: the selected one if it can be highlighted, otherwise the first. */
export function getInitialOption(container: HTMLElement, value: string | null, which: "selected" | "first" | "last") {
  const values = getOptionValues(container);
  if (which === "last") return values.at(-1);
  if (which === "selected" && value !== null && values.includes(value)) return value;
  return values[0];
}

/** The plain text inside an option's children, which its control shows once it's selected. */
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
 * A control's label as text, so its listbox can carry the same name. It reads `aria-labelledby`,
 * then any `<label for>`, then `aria-label`. A control can be any element, like a group of fields.
 */
export function getControlLabel(control: HTMLElement) {
  const labelledBy = control.getAttribute("aria-labelledby");
  const fromIds = labelledBy
    ?.split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent?.trim())
    .filter(Boolean)
    .join(" ");
  if (fromIds) return fromIds;
  const labels = "labels" in control ? (control as HTMLInputElement).labels : null;
  const fromLabels = Array.from(labels ?? [], (label) => label.textContent?.trim())
    .filter(Boolean)
    .join(" ");
  return fromLabels || control.getAttribute("aria-label") || undefined;
}
