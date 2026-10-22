import { useVideoPlayer } from "@/lib/video-player-context";
import { MutedIcon, VolumeIcon } from "@/lib/video-player-icons";
import { Button } from "@/components/Button/Button";
import type { VideoPlayerMuteProps } from "./VideoPlayerMute.types";

/**
 * Button that mutes or unmutes a VideoPlayer. Its name says what pressing it does: "Mute" or
 * "Unmute". A video turned all the way down counts as muted, and unmuting brings it back at half volume.
 */
export function VideoPlayerMute({
  variant = "ghost",
  size = "icon",
  muteLabel = "Mute",
  unmuteLabel = "Unmute",
  onClick,
  ...props
}: VideoPlayerMuteProps) {
  const player = useVideoPlayer();
  const silent = player.muted || player.volume === 0;

  return (
    <Button
      data-slot="video-player-mute"
      variant={variant}
      size={size}
      aria-label={silent ? unmuteLabel : muteLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) player.toggleMute();
      }}
      {...props}
    >
      {silent ? <MutedIcon /> : <VolumeIcon />}
    </Button>
  );
}
