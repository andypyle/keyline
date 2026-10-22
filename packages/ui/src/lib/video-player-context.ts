import { createContext, useContext } from "react";

/** What a VideoPlayer shares with its parts: the video's state, mirrored from its media events, and the actions on it. */
export interface VideoPlayerContextValue {
  /** Registers the VideoPlayerVideo's element, so the player can follow its events. */
  setVideo: (video: HTMLVideoElement | null) => void;
  paused: boolean;
  /** Seconds from the start. */
  currentTime: number;
  /** Seconds, or 0 until the video's metadata loads. `Infinity` for a live stream. */
  duration: number;
  /** Where the buffered stretch around the current position ends, in seconds. */
  bufferedEnd: number;
  /** 0 to 1. */
  volume: number;
  muted: boolean;
  /** Whether the video has a captions or subtitles track. */
  hasCaptions: boolean;
  captionsOn: boolean;
  fullscreen: boolean;
  /** Whether the browser lets the player go full screen, or at least the video (on iPhone). */
  canFullscreen: boolean;
  /** The id of the keyboard shortcuts' description, which describes the video; unset while they're off. */
  shortcutsDescriptionId: string | undefined;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleCaptions: () => void;
  toggleFullscreen: () => void;
}

export const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

/** Returns the enclosing VideoPlayer's state. Throws outside one, since the parts can't work alone. */
export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context) throw new Error("VideoPlayer parts must be rendered inside a VideoPlayer.");
  return context;
}
