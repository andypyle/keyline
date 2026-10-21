import { createContext, useContext, type ReactNode, type RefObject } from "react";
import type { ListboxActive, ListboxItemRecord } from "./listbox";

/** What a Combobox shares with its input, content and items. */
export interface ComboboxContextValue {
  value: string | null;
  /** Selects a value (or clears it with `null`), calling onValueChange if it changed, and closes the list. */
  select: (value: string | null) => void;
  /**
   * Settles the typed text as the input loses focus: picks an option it names exactly, clears the
   * value if it's empty, and otherwise keeps it as a custom value or puts back the selected text.
   */
  commit: () => void;
  /** The selected option's text (or the custom value) and icon. Remembered after the option stops rendering, as loaded results change. */
  selectedText: string;
  selectedIcon: ReactNode;
  allowCustomValue: boolean;
  open: boolean;
  /** Opens or closes the list. Closing clears the search and the highlight. */
  setOpen: (open: boolean) => void;
  active: ListboxActive | null;
  setActive: (active: ListboxActive | null) => void;
  /** The text in the input. While the list is closed it's the selected option's text. */
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  /** What the options are filtered by. Empty while the list is open but nothing's been typed, so all options show. */
  query: string;
  setQuery: (query: string) => void;
  /** Whether an option with this text matches the current query. */
  matches: (text: string) => boolean;
  /** Whether any option matches the current query. */
  hasMatches: boolean;
  disabled: boolean;
  inputId: string;
  contentId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  items: ReadonlyMap<string, ListboxItemRecord>;
  /** Adds or updates an item, returning a function that removes it. */
  registerItem: (value: string, record: ListboxItemRecord) => () => void;
}

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

/** Returns the enclosing Combobox's state. Throws outside one, since the parts can't work alone. */
export function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) throw new Error("Combobox parts must be rendered inside a Combobox.");
  return context;
}

// Folds case and accents, so "creme" finds "Crème brûlée".
const fold = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** The default filter: the option's text contains the query, ignoring case and accents. */
export function defaultComboboxFilter(text: string, query: string) {
  return fold(text).includes(fold(query.trim()));
}

/** Whether typed text names an option exactly, ignoring case and accents. */
export function namesOption(text: string, typed: string) {
  return fold(text) === fold(typed.trim());
}
