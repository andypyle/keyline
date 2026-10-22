import type { ComponentPropsWithRef } from "react";
import type { BadgeProps } from "@/components/Badge/Badge.types";

/**
 * `className`, `ref` and other attributes go to the `li`. The Badge options style the tag inside it,
 * which defaults to a neutral outline.
 */
export interface CardTagProps
  extends ComponentPropsWithRef<"li">,
    Pick<BadgeProps, "variant" | "tone" | "size" | "startIcon" | "endIcon"> {}
