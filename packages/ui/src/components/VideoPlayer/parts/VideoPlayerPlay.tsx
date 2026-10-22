import { useVideoPlayer } from "../../../lib/video-player-context";
import { PauseIcon, PlayIcon } from "../../../lib/video-player-icons";
import { Button } from "../../Button/Button";
import type { VideoPlayerPlayProps } from "./VideoPlayerPlay.types";

/** Button that plays or pauses a VideoPlayer. Its name says what pressing it does: "Play" or "Pause". */
export function VideoPlayerPlay({
  variant = "ghost",
  size = "icon",
  playLabel = "Play",
  pauseLabel = "Pause",
  onClick,
  ...props
}: VideoPlayerPlayProps) {
  const player = useVideoPlayer();

  return (
    <Button
      data-slot="video-player-play"
      variant={variant}
      size={size}
      aria-label={player.paused ? playLabel : pauseLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) player.togglePlay();
      }}
      {...props}
    >
      {player.paused ? <PlayIcon /> : <PauseIcon />}
    </Button>
  );
}
