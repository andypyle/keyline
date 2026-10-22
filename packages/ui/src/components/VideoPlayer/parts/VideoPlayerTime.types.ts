import type { ComponentPropsWithRef } from "react";

/** Takes every native span prop except `children`: it shows the position and length. */
export interface VideoPlayerTimeProps extends Omit<ComponentPropsWithRef<"span">, "children"> {}
