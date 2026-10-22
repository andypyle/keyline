import type { ButtonProps } from "../../Button/Button.types";

/** Takes every Button prop except `children`: the button shows an icon and is named by its label. */
export interface VideoPlayerPlayProps extends Omit<ButtonProps, "children"> {
  /** The button's name while the video is paused. Defaults to "Play". */
  playLabel?: string;
  /** The button's name while the video plays. Defaults to "Pause". */
  pauseLabel?: string;
}
