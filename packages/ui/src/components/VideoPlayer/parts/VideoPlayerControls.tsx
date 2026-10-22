import { cn } from "@/lib/cn";
import { VideoPlayerCaptions } from "./VideoPlayerCaptions";
import type { VideoPlayerControlsProps } from "./VideoPlayerControls.types";
import { VideoPlayerFullscreen } from "./VideoPlayerFullscreen";
import { VideoPlayerMute } from "./VideoPlayerMute";
import { VideoPlayerPlay } from "./VideoPlayerPlay";
import { VideoPlayerSeek } from "./VideoPlayerSeek";
import { VideoPlayerTime } from "./VideoPlayerTime";
import { VideoPlayerVolume } from "./VideoPlayerVolume";

/**
 * Bar under a VideoPlayer's video that holds its controls, grouped and named "Video controls" for
 * assistive tech. Without children it holds the full set; pass the parts you want to choose and
 * order them yourself. In a player narrower than 24rem, the seek bar moves to a row of its own above
 * the buttons.
 */
export function VideoPlayerControls({ className, children, ...props }: VideoPlayerControlsProps) {
  return (
    <div
      data-slot="video-player-controls"
      role="group"
      aria-label="Video controls"
      className={cn(
        [
          "kl:flex",
          "kl:shrink-0",
          "kl:flex-wrap",
          "kl:items-center",
          "kl:gap-x-1",
          "kl:gap-y-1.5",
          "kl:p-1.5",
          "kl:border-t-(length:--kl-video-player-border)",
          "kl:border-line",
        ],
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <VideoPlayerPlay />
          <VideoPlayerSeek />
          <VideoPlayerTime />
          <VideoPlayerMute />
          <VideoPlayerVolume />
          <VideoPlayerCaptions />
          <VideoPlayerFullscreen />
        </>
      )}
    </div>
  );
}
