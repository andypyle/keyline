import { createContext, useContext } from "react";
import type { ButtonVariantProps } from "../components/Button/Button.variants";

/** What a ButtonGroup shares with the Buttons inside it. */
export interface ButtonGroupContextValue {
  orientation: "horizontal" | "vertical";
  size?: ButtonVariantProps["size"];
  variant?: ButtonVariantProps["variant"];
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/** Returns the enclosing ButtonGroup's settings, or null outside a group. */
export function useButtonGroup() {
  return useContext(ButtonGroupContext);
}
