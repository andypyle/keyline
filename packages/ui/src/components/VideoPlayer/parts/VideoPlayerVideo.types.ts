import type { ComponentPropsWithRef } from "react";

/** Takes every native video prop except `controls`: the VideoPlayer's controls replace the browser's. */
export interface VideoPlayerVideoProps extends Omit<ComponentPropsWithRef<"video">, "controls"> {}
