import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SelectItemVariantProps } from "./SelectItem.variants";

export interface SelectItemProps extends ComponentPropsWithRef<"div">, SelectItemVariantProps {
  /** The value this option stands for. Unique within its Select. */
  value: string;
  /** Icon before the option's text, also shown in the trigger while the option is selected. Icons are hidden from assistive tech, so the text alone names the option. */
  icon?: ReactNode;
  /** Leaves the option in the list but stops it being picked. Arrow keys and typeahead skip it. */
  disabled?: boolean;
  /** The text the trigger shows and typeahead matches, when the children aren't plain text. Defaults to the children's text. */
  textValue?: string;
}
