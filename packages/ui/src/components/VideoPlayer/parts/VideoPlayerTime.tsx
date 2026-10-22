import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/media-time";
import { useVideoPlayer } from "@/lib/video-player-context";
import type { VideoPlayerTimeProps } from "./VideoPlayerTime.types";

/**
 * Shows a VideoPlayer's position and length, like "1:20 / 4:05". It's hidden from assistive tech,
 * since the seek slider announces the same in words; it isn't a live region, so it doesn't
 * interrupt as the video plays. It's hidden in a player narrower than 18rem, to leave room for the buttons.
 */
export function VideoPlayerTime({ className, ...props }: VideoPlayerTimeProps) {
  const player = useVideoPlayer();

  return (
    <span
      data-slot="video-player-time"
      aria-hidden
      className={cn(
        [
          "kl:shrink-0",
          "kl:px-1",
          "kl:font-mono",
          "kl:text-xs",
          "kl:tabular-nums",
          "kl:text-fg-2",
          "kl:select-none",
          "kl:@max-2xs/video-player:hidden",
        ],
        className,
      )}
      {...props}
    >
      {formatClock(player.currentTime)} / {formatClock(player.duration)}
    </span>
  );
}
