import type { MouseEvent } from "react";
import { cn } from "../../../lib/cn";
import { useModal } from "../../../lib/modal-context";
import { Slot } from "../../../lib/slot";
import { PlayIcon } from "../../../lib/video-player-icons";
import type { VideoModalTriggerProps } from "./VideoModalTrigger.types";

/**
 * Poster button that opens a VideoModal: the poster cropped to 16:9 with a play badge over it, named
 * by its (hidden) children. With `asChild`, its one child becomes the trigger instead, like a
 * Button or a Card's action, and keeps its own look.
 */
export function VideoModalTrigger({
  className,
  poster,
  asChild,
  children,
  type = "button",
  onClick,
  ...props
}: VideoModalTriggerProps) {
  const modal = useModal();
  const triggerProps = {
    "data-slot": "video-modal-trigger",
    "aria-haspopup": "dialog" as const,
    "aria-controls": modal.contentId,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) modal.setOpen(true);
    },
  };

  if (asChild) {
    return (
      <Slot className={className} {...triggerProps} {...(props as object)}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        [
          "kl:group/video-modal-trigger",
          "kl:relative",
          "kl:block",
          "kl:overflow-hidden",
          "kl:w-full",
          "kl:aspect-video",
          "kl:m-0",
          "kl:p-0",
          "kl:bg-sunken",
          "kl:border-3",
          "kl:border-line",
          "kl:rounded-lg",
          "kl:shadow-md",
          "kl:transition-[translate,box-shadow]",
          "kl:duration-120",
          "kl:ease-out",
          "kl:cursor-pointer",
          "kl:hover:-translate-0.5",
          "kl:hover:shadow-lg",
          "kl:active:translate-1",
          "kl:active:shadow-none",
          "kl:focus-visible:outline-3",
          "kl:focus-visible:outline-offset-4",
          "kl:focus-visible:outline-focus",
          "kl:motion-reduce:transition-none",
        ],
        className,
      )}
      {...triggerProps}
      {...props}
    >
      {poster && <img src={poster} alt="" className={cn(["kl:block", "kl:size-full", "kl:object-cover"])} />}
      {/* The play badge grows a little while the poster is hovered or focused. */}
      <span
        aria-hidden
        className={cn([
          "kl:absolute",
          "kl:inset-0",
          "kl:grid",
          "kl:place-items-center",
          "kl:pointer-events-none",
        ])}
      >
        <span
          className={cn([
            "kl:grid",
            "kl:place-items-center",
            "kl:size-14",
            "kl:ps-1",
            "kl:bg-thumb",
            "kl:text-on-fill",
            "kl:border-3",
            "kl:border-line",
            "kl:rounded-full",
            "kl:shadow-md",
            "kl:transition-transform",
            "kl:duration-200",
            "kl:ease-bounce",
            "kl:[&_svg]:size-6",
            "kl:group-hover/video-modal-trigger:scale-110",
            "kl:group-focus-visible/video-modal-trigger:scale-110",
            "kl:motion-reduce:transition-none",
          ])}
        >
          <PlayIcon />
        </span>
      </span>
      <span className={cn(["kl:sr-only"])}>{children}</span>
    </button>
  );
}
