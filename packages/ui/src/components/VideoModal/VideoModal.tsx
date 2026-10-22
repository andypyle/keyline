import { Modal } from "../Modal/Modal";
import type { VideoModalProps } from "./VideoModal.types";

/**
 * Opens a video in a modal from a poster. Compose it from a VideoModalTrigger and a
 * VideoModalContent holding a VideoModalTitle, a VideoPlayerVideo and VideoPlayerControls.
 *
 * It's a Modal, so it can be controlled the same way, and the browser keeps focus inside while it's
 * open and returns it to the trigger on close. Opening starts the video from the beginning with
 * focus on it, so the player's keyboard shortcuts work straight away; closing pauses it.
 */
export function VideoModal(props: VideoModalProps) {
  return <Modal data-slot="video-modal" {...props} />;
}
