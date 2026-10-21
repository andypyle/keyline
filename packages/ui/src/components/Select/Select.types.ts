import type { ComponentPropsWithRef } from "react";

export interface SelectProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue"> {
  /** The selected value, or `null` for none. Pass it with `onValueChange` to control the Select; leave it out to let the Select manage itself. */
  value?: string | null;
  /** The value an uncontrolled Select starts with. */
  defaultValue?: string;
  /** Called with the new value when the user picks a different option. */
  onValueChange?: (value: string) => void;
  /** Whether the list is open. Pass it with `onOpenChange` to control it. */
  open?: boolean;
  /** Whether an uncontrolled list starts open. */
  defaultOpen?: boolean;
  /** Called when the list asks to open or close: from the trigger, an option, Escape, Tab or a click outside. */
  onOpenChange?: (open: boolean) => void;
  /** Submits the value with a surrounding form under this name. */
  name?: string;
  /** The id of a form to submit with, when the Select isn't inside it. */
  form?: string;
  /** Blocks form submission until a value is picked, like a native `required` field. */
  required?: boolean;
  /** Disables the trigger, and leaves the value out of form submission. */
  disabled?: boolean;
}
