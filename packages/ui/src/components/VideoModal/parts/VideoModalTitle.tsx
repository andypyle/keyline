import { cn } from "../../../lib/cn";
import { ModalTitle } from "../../Modal/parts/ModalTitle";
import type { VideoModalTitleProps } from "./VideoModalTitle.types";

/**
 * Title over the top of a VideoModal's video that names the dialog. It's a chip with a solid face,
 * so it reads on any frame, and it fades out while the pointer is over the video so the whole
 * picture shows. Faded, it still names the dialog. It leaves room for the close button opposite.
 */
export function VideoModalTitle({ className, ...props }: VideoModalTitleProps) {
  return (
    <ModalTitle
      data-slot="video-modal-title"
      className={cn(
        [
          "kl:absolute",
          "kl:top-3",
          "kl:left-3",
          "kl:z-10",
          "kl:max-w-[calc(100%-5.5rem)]",
          "kl:px-3",
          "kl:py-1.5",
          "kl:pe-3",
          "kl:text-base",
          "kl:truncate",
          "kl:bg-surface",
          "kl:border-2",
          "kl:border-line",
          "kl:rounded-md",
          "kl:shadow-sm",
          "kl:transition-opacity",
          "kl:duration-200",
          "kl:ease-out",
          "kl:pointer-events-none",
          "kl:group-has-[[data-slot=video-player-video]:hover]/video-player:opacity-0",
          "kl:motion-reduce:transition-none",
        ],
        className,
      )}
      {...props}
    />
  );
}
