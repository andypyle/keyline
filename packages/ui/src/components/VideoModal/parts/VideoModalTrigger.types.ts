import type { ComponentPropsWithRef, ReactNode } from "react";

export interface VideoModalTriggerProps extends ComponentPropsWithRef<"button"> {
  /** The poster image's URL. It's decorative: the trigger is named by its children. Ignored with `asChild`. */
  poster?: string;
  /**
   * The button's accessible name, like "Watch the launch talk". It isn't shown, since the poster
   * stands for it; put a visible caption beside the trigger if you need one. With `asChild`, the
   * one element to use as the trigger instead.
   */
  children: ReactNode;
  /** Makes the child element the trigger, in place of the poster: it takes the trigger's behavior and ARIA. */
  asChild?: boolean;
}
