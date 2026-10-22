import { cn } from "@/lib/cn";
import { useVideoPlayer } from "@/lib/video-player-context";
import { Slider } from "@/components/Slider/Slider";
import type { VideoPlayerVolumeProps } from "./VideoPlayerVolume.types";

/**
 * Slider that sets a VideoPlayer's volume, announced as a percentage. Muted, it reads 0; turning it
 * down to 0 mutes, and up from there unmutes. It's hidden while the player is narrower than 28rem,
 * leaving the mute button; give it a `className` with a display to keep it.
 */
export function VideoPlayerVolume({ className, size = "sm", step = 0.05, ...props }: VideoPlayerVolumeProps) {
  const player = useVideoPlayer();

  return (
    <Slider
      data-slot="video-player-volume"
      aria-label="Volume"
      size={size}
      min={0}
      max={1}
      step={step}
      value={player.muted ? 0 : player.volume}
      onValueChange={player.setVolume}
      getValueText={(value) => `${Math.round(value * 100)}%`}
      className={cn(["kl:hidden", "kl:w-20", "kl:mr-1", "kl:@md/video-player:block"], className)}
      {...props}
    />
  );
}
