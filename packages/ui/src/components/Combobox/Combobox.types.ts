import type { ComponentPropsWithRef } from "react";

export interface ComboboxProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue"> {
  /** The selected value, or `null` for none. Pass it with `onValueChange` to control the Combobox; leave it out to let the Combobox manage itself. */
  value?: string | null;
  /** The value an uncontrolled Combobox starts with. */
  defaultValue?: string;
  /** Called with the new value when the user picks a different option, or with `null` when they clear the text. */
  onValueChange?: (value: string | null) => void;
  /** Whether the list is open. Pass it with `onOpenChange` to control it. */
  open?: boolean;
  /** Whether an uncontrolled list starts open. */
  defaultOpen?: boolean;
  /** Called when the list asks to open or close: from typing, the arrow keys, the toggle, an option, Escape or the input losing focus. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Decides which options show for the typed text. Defaults to options whose text contains it,
   * ignoring case and accents. Pass `false` to show every rendered option, when you filter them
   * yourself, for example by fetching results in `onQueryChange`.
   */
  filter?: ((text: string, query: string) => boolean) | false;
  /**
   * Called with the text options are filtered by: what's typed, or `""` when the list opens in
   * full or closes. Use it with `filter={false}` to load options as the user types; debounce
   * there if you need to.
   */
  onQueryChange?: (query: string) => void;
  /**
   * Lets the value be any text, not just an option. Typing no longer highlights the first match,
   * so Enter or leaving the field keeps exactly what was typed; ArrowDown still picks from the list.
   */
  allowCustomValue?: boolean;
  /** Submits the value with a surrounding form under this name. */
  name?: string;
  /** The id of a form to submit with, when the Combobox isn't inside it. */
  form?: string;
  /** Blocks form submission until a value is picked, like a native `required` field. */
  required?: boolean;
  /** Disables the input, and leaves the value out of form submission. */
  disabled?: boolean;
}
