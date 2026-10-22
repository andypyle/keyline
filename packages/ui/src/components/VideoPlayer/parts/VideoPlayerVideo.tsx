import { useMemo } from "react";
import { cn } from "../../../lib/cn";
import { mergeRefs } from "../../../lib/merge-refs";
import { useVideoPlayer } from "../../../lib/video-player-context";
import type { VideoPlayerVideoProps } from "./VideoPlayerVideo.types";

/**
 * The video a VideoPlayer plays, letterboxed to fit the player's `ratio`. Clicking it
 * plays or pauses. It plays inline (not full screen on iPhone) unless told otherwise. Put
 * `<track kind="captions">` elements inside it for captions.
 *
 * While the player takes keyboard shortcuts, the video is a tab stop described by the list of
 * them, and clicking it focuses it, so the shortcuts work straight after.
 */
export function VideoPlayerVideo({
  ref,
  className,
  playsInline = true,
  tabIndex,
  "aria-describedby": describedBy,
  onClick,
  ...props
}: VideoPlayerVideoProps) {
  const player = useVideoPlayer();
  const mergedRef = useMemo(() => mergeRefs(player.setVideo, ref), [player.setVideo, ref]);

  return (
    <video
      data-slot="video-player-video"
      playsInline={playsInline}
      tabIndex={tabIndex ?? (player.shortcutsDescriptionId ? 0 : undefined)}
      aria-describedby={[describedBy, player.shortcutsDescriptionId].filter(Boolean).join(" ") || undefined}
      className={cn(
        [
          "kl:block",
          "kl:w-full",
          "kl:aspect-(--kl-video-player-ratio)",
          "kl:min-h-0",
          "kl:object-contain",
          "kl:bg-sunken",
          "kl:cursor-pointer",
          // Inset, since the player clips anything past its edge.
          "kl:focus-visible:outline-3",
          "kl:focus-visible:-outline-offset-4",
          "kl:focus-visible:outline-focus",
          "kl:group-data-fullscreen/video-player:flex-1",
          "kl:group-data-fullscreen/video-player:aspect-auto",
        ],
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) player.togglePlay();
      }}
      {...props}
      ref={mergedRef}
    />
  );
}
