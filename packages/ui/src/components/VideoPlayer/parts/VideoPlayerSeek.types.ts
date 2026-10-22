import type { SliderProps } from "@/components/Slider/Slider.types";

/**
 * Takes the Slider props that don't set its value or range: the video's position and length do.
 * `step` (1 second) and `largeStep` (a tenth of the video) set how far the keys move.
 */
export interface VideoPlayerSeekProps
  extends Omit<
    SliderProps,
    "value" | "defaultValue" | "onValueChange" | "min" | "max" | "getValueText" | "name" | "form" | "children"
  > {}
