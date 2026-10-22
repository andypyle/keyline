import type { ComponentPropsWithRef } from "react";
import type { MediaVideoVariantProps } from "./MediaVideo.variants";

export interface MediaVideoProps extends ComponentPropsWithRef<"video">, MediaVideoVariantProps {}
