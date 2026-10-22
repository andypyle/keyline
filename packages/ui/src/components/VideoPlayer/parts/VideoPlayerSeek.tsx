import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { formatSpokenTime } from "@/lib/media-time";
import { useVideoPlayer } from "@/lib/video-player-context";
import { Slider } from "@/components/Slider/Slider";
import type { VideoPlayerSeekProps } from "./VideoPlayerSeek.types";

/**
 * Slider that shows and sets a VideoPlayer's position, with the buffered stretch shaded behind it.
 * It seeks as it moves, so dragging scrubs through the video. It's announced as, for example, "1
 * minute 20 seconds of 4 minutes", and disabled until the video's length is known, or for a live stream.
 */
export function VideoPlayerSeek({ className, size = "sm", disabled, ...props }: VideoPlayerSeekProps) {
  const player = useVideoPlayer();
  const seekable = Number.isFinite(player.duration) && player.duration > 0;
  const max = seekable ? player.duration : 0;
  const buffered = seekable ? Math.min(1, player.bufferedEnd / player.duration) : 0;

  return (
    <Slider
      data-slot="video-player-seek"
      aria-label="Seek"
      size={size}
      min={0}
      max={max}
      value={Math.min(player.currentTime, max)}
      onValueChange={player.seek}
      getValueText={(value) => `${formatSpokenTime(value)} of ${formatSpokenTime(max)}`}
      disabled={disabled ?? !seekable}
      className={cn(
        [
          "kl:flex-1",
          "kl:min-w-16",
          "kl:mx-2",
          "kl:@max-sm/video-player:order-first",
          "kl:@max-sm/video-player:basis-full",
          "kl:@max-sm/video-player:mx-0",
        ],
        className,
      )}
      {...props}
    >
      <span
        data-slot="video-player-buffered"
        className={cn([
          "kl:absolute",
          "kl:inset-y-0",
          "kl:left-0",
          "kl:w-[calc(var(--kl-slider-thumb)/2+(100%-var(--kl-slider-thumb))*var(--kl-video-player-buffered))]",
          "kl:bg-subtle",
        ])}
        style={{ "--kl-video-player-buffered": buffered } as CSSProperties}
      />
    </Slider>
  );
}
