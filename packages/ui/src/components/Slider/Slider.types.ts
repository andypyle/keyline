import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SliderVariantProps } from "./Slider.variants";

export interface SliderProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue">, SliderVariantProps {
  /** The value. Pass it with `onValueChange` to control the Slider; leave it out to let the Slider manage itself. */
  value?: number;
  /** The value an uncontrolled Slider starts with. Defaults to `min`. */
  defaultValue?: number;
  /** Called with the new value on every change, while dragging and on each key press. */
  onValueChange?: (value: number) => void;
  /**
   * Called with the value when a change is finished: when a drag or click ends, and on each key
   * press. Use it for work that shouldn't run on every step of a drag, like seeking a video or
   * fetching results.
   */
  onValueCommit?: (value: number) => void;
  /** The lowest value. Defaults to 0. */
  min?: number;
  /** The highest value. Defaults to 100. */
  max?: number;
  /** The amount each value differs by, and each arrow key moves. Defaults to 1. */
  step?: number;
  /** How far Page Up and Page Down move. Defaults to a tenth of the range, rounded to a whole step. */
  largeStep?: number;
  /**
   * Turns the value into the text assistive tech announces, like `"40%"` or `"1 minute 20 seconds"`.
   * Without it, the number is announced.
   */
  getValueText?: (value: number) => string;
  /** Submits the value with a surrounding form under this name. */
  name?: string;
  /** The id of a form to submit with, when the Slider isn't inside it. */
  form?: string;
  /**
   * Rendered inside the track, behind the filled range, for marks like a video's buffered
   * progress. Position them against the track; the slider handles all input.
   */
  children?: ReactNode;
  /** Stops the value changing, skips the Slider in keyboard navigation, and leaves it out of form submission. */
  disabled?: boolean;
}
