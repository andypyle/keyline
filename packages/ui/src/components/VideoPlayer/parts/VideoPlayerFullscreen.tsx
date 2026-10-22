import { useVideoPlayer } from "../../../lib/video-player-context";
import { ExitFullscreenIcon, FullscreenIcon } from "../../../lib/video-player-icons";
import { Button } from "../../Button/Button";
import type { VideoPlayerFullscreenProps } from "./VideoPlayerFullscreen.types";

/**
 * Button that takes a VideoPlayer in or out of full screen, controls and all. On iPhone, which only
 * lets a video go full screen, it opens the video in the system player instead. It renders nothing
 * where full screen isn't allowed, such as in an iframe without `allow="fullscreen"`.
 */
export function VideoPlayerFullscreen({
  variant = "ghost",
  size = "icon",
  enterLabel = "Full screen",
  exitLabel = "Exit full screen",
  onClick,
  ...props
}: VideoPlayerFullscreenProps) {
  const player = useVideoPlayer();
  if (!player.canFullscreen) return null;

  return (
    <Button
      data-slot="video-player-fullscreen"
      variant={variant}
      size={size}
      aria-label={player.fullscreen ? exitLabel : enterLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) player.toggleFullscreen();
      }}
      {...props}
    >
      {player.fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
    </Button>
  );
}
