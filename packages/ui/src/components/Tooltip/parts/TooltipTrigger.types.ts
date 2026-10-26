import type { ButtonProps } from "@/components/Button/Button.types";

/** Takes every Button prop, or, with `asChild`, the props to merge onto its child. */
export interface TooltipTriggerProps extends ButtonProps {
  /**
   * Makes the one child element the trigger, in place of the Button: a link, or a component's own
   * trigger. It must be focusable, so keyboard users can reach the tooltip too.
   */
  asChild?: boolean;
}
