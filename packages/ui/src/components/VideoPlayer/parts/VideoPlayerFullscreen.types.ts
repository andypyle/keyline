import type { ButtonProps } from "@/components/Button/Button.types";

/** Takes every Button prop except `children`: the button shows an icon and is named by its label. */
export interface VideoPlayerFullscreenProps extends Omit<ButtonProps, "children"> {
  /** The button's name outside full screen. Defaults to "Full screen". */
  enterLabel?: string;
  /** The button's name in full screen. Defaults to "Exit full screen". */
  exitLabel?: string;
}
