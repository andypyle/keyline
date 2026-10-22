import { useVideoPlayer } from "@/lib/video-player-context";
import { CaptionsIcon } from "@/lib/video-player-icons";
import { Button } from "@/components/Button/Button";
import type { VideoPlayerCaptionsProps } from "./VideoPlayerCaptions.types";

/**
 * Button that turns a VideoPlayer's captions on or off. Turning them on shows the first captions or
 * subtitles track; give a `<track>` the `default` attribute to start with it showing. It renders
 * nothing while the video has no such track.
 */
export function VideoPlayerCaptions({
  variant = "ghost",
  size = "icon",
  showLabel = "Turn on captions",
  hideLabel = "Turn off captions",
  onClick,
  ...props
}: VideoPlayerCaptionsProps) {
  const player = useVideoPlayer();
  if (!player.hasCaptions) return null;

  return (
    <Button
      data-slot="video-player-captions"
      variant={variant}
      size={size}
      aria-label={player.captionsOn ? hideLabel : showLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) player.toggleCaptions();
      }}
      {...props}
    >
      <CaptionsIcon on={player.captionsOn} />
    </Button>
  );
}
