import type { ComponentPropsWithRef, ReactNode } from "react";

export interface ComboboxItemProps extends ComponentPropsWithRef<"div"> {
  /** The value this option stands for. Unique within its Combobox. */
  value: string;
  /** Icon before the option's text. Icons are hidden from assistive tech, so the text alone names the option. */
  icon?: ReactNode;
  /** Leaves the option in the list but stops it being picked. Arrow keys skip it, and typing its name doesn't pick it. */
  disabled?: boolean;
  /** The text the input shows and the filter matches, when the children aren't plain text. Defaults to the children's text. */
  textValue?: string;
}
