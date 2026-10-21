import { createContext, useContext } from "react";
import type { RadioVariantProps } from "../components/Radio/Radio.variants";

/** What a RadioGroup shares with the Radios inside it. */
export interface RadioGroupContextValue {
  /** Shared by every Radio, which is what makes the browser treat them as one group: one checked, arrow keys move between them. */
  name: string;
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
  size?: RadioVariantProps["size"];
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Returns the enclosing RadioGroup's state, or null outside a group. */
export function useRadioGroup() {
  return useContext(RadioGroupContext);
}
