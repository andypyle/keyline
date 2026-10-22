import type { ButtonProps } from "../../Button/Button.types";

/** Takes every Button prop except `children`: the button shows an icon and is named by its label. */
export interface VideoPlayerCaptionsProps extends Omit<ButtonProps, "children"> {
  /** The button's name while captions are off. Defaults to "Turn on captions". */
  showLabel?: string;
  /** The button's name while captions show. Defaults to "Turn off captions". */
  hideLabel?: string;
}
