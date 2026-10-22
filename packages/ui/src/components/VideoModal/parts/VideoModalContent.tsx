import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { useModal } from "@/lib/modal-context";
import { ModalContent } from "@/components/Modal/parts/ModalContent";
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer";
import type { VideoModalContentProps } from "./VideoModalContent.types";

/**
 * Dialog that plays a VideoModal's video: a wide panel holding a VideoPlayer, with the modal's
 * close button over the video's top corner. Put a VideoModalTitle, a VideoPlayerVideo and
 * VideoPlayerControls inside.
 *
 * Opening restarts the video, plays it (`autoPlay`) and moves focus to it, so the player's keyboard
 * shortcuts work straight away. The click that opened it counts as the user's go-ahead, so it plays
 * with sound; if the browser blocks that anyway, the play button is there. Closing pauses it.
 */
export function VideoModalContent({
  className,
  ratio,
  keyboardShortcuts,
  autoPlay = true,
  children,
  ...props
}: VideoModalContentProps) {
  const { open, contentRef } = useModal();

  // Runs after ModalContent's own effect, which opens the dialog, since children's effects run first.
  useEffect(() => {
    const video = contentRef.current?.querySelector("video");
    if (!video) return;
    if (!open) {
      video.pause();
      return;
    }
    video.currentTime = 0;
    if (video.tabIndex >= 0) video.focus();
    // play() rejects when the browser blocks it; the controls show the video as paused.
    if (autoPlay) video.play().catch(() => {});
  }, [open, autoPlay, contentRef]);

  return (
    <ModalContent
      data-slot="video-modal-content"
      className={cn(
        [
          "kl:max-w-5xl",
          "kl:p-0",
          // The player is the panel's only child, so it fills it rather than laying out in a column.
          "kl:open:block",
          // The close button sits on the video, so it gets a solid face to stay visible on any frame. The
          // face stays light in dark mode, so the X takes the dark on-fill color.
          "kl:*:data-[slot=modal-close-button]:top-3",
          "kl:*:data-[slot=modal-close-button]:right-3",
          "kl:*:data-[slot=modal-close-button]:bg-thumb",
          "kl:*:data-[slot=modal-close-button]:text-on-fill",
          "kl:*:data-[slot=modal-close-button]:border-line",
          "kl:*:data-[slot=modal-close-button]:shadow-sm",
          "kl:*:data-[slot=modal-close-button]:hover:bg-thumb-hover",
        ],
        className,
      )}
      {...props}
    >
      <VideoPlayer ratio={ratio} keyboardShortcuts={keyboardShortcuts} radius="none" flat noBorders>
        {children}
      </VideoPlayer>
    </ModalContent>
  );
}
