import type { ModalContentProps } from "../../Modal/parts/ModalContent.types";
import type { VideoPlayerProps } from "../../VideoPlayer/VideoPlayer.types";

/**
 * Takes every ModalContent prop except `size` (the panel is sized for video) and `noCloseButton`
 * (the corner close button is how pointer users leave).
 */
export interface VideoModalContentProps extends Omit<ModalContentProps, "size" | "noCloseButton"> {
  /** The width/height ratio of the video's area. Defaults to `16/9`. */
  ratio?: VideoPlayerProps["ratio"];
  /** Whether the player takes keyboard shortcuts. Defaults to true. */
  keyboardShortcuts?: boolean;
  /** Whether opening plays the video. Defaults to true; either way, it starts from the beginning. */
  autoPlay?: boolean;
}
