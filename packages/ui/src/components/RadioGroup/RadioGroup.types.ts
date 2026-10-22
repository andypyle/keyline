import type { ComponentPropsWithRef } from "react";
import type { RadioVariantProps } from "@/components/Radio/Radio.variants";
import type { RadioGroupVariantProps } from "./RadioGroup.variants";

export interface RadioGroupProps
  extends Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange">,
    RadioGroupVariantProps {
  /** The chosen value, or `null` for none. Pass it with `onValueChange` to control the group; leave it out to let the group manage itself. */
  value?: string | null;
  /** The value an uncontrolled group starts with. */
  defaultValue?: string;
  /** Called with the new value when the user picks a different Radio. */
  onValueChange?: (value: string) => void;
  /** Submits the chosen value with a surrounding form under this name. Without one, the group gets a generated name, which forms would submit too, so set it inside a form. */
  name?: string;
  /** Disables every Radio in the group. */
  disabled?: boolean;
  /** Blocks form submission until a Radio is chosen. */
  required?: boolean;
  /** The size of every Radio in the group; a Radio's own `size` wins. */
  size?: RadioVariantProps["size"];
}
