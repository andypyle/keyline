import type { ButtonProps } from "../../Button/Button.types";

/** Takes every Button prop except `children`: the button shows an icon and is named by its label. */
export interface VideoPlayerMuteProps extends Omit<ButtonProps, "children"> {
  /** The button's name while sound is on. Defaults to "Mute". */
  muteLabel?: string;
  /** The button's name while muted. Defaults to "Unmute". */
  unmuteLabel?: string;
}
