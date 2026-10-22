import type { ComponentPropsWithRef } from "react";
import type { VideoPlayerVariantProps } from "./VideoPlayer.variants";

export interface VideoPlayerProps extends ComponentPropsWithRef<"div">, VideoPlayerVariantProps {
  /** Whether the player takes keyboard shortcuts while focus is in it. Defaults to true. */
  keyboardShortcuts?: boolean;
  /** Describes the keyboard shortcuts to assistive tech, on the video. Replace it to translate it. */
  shortcutsDescription?: string;
}
