import type { SliderProps } from "../../Slider/Slider.types";

/** Takes the Slider props that don't set its value or range: the video's volume does, from 0 to 1. */
export interface VideoPlayerVolumeProps
  extends Omit<
    SliderProps,
    "value" | "defaultValue" | "onValueChange" | "min" | "max" | "getValueText" | "name" | "form" | "children"
  > {}
