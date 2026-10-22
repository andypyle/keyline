import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { useField, useFieldControlProps } from "../../lib/field-context";
import { mergeRefs } from "../../lib/merge-refs";
import { useFormReset } from "../../lib/use-form-reset";
import type { SliderProps } from "./Slider.types";
import { sliderRangeVariants, sliderThumbVariants, sliderTrackVariants, sliderVariants } from "./Slider.variants";

function decimals(value: number) {
  return value.toString().split(".")[1]?.length ?? 0;
}

/**
 * Picks a number in a range by dragging a thumb or with the arrow keys. Name it with `aria-label`
 * or `aria-labelledby`, or put it in a Field, whose label names it. Props and `className` go to the
 * slider element.
 *
 * It follows the WAI-ARIA slider pattern: the arrow keys move by `step`, Page Up and Page Down by
 * `largeStep`, and Home and End go to `min` and `max`. Pressing anywhere on the track moves the
 * thumb there, and dragging follows the pointer until it's released.
 */
export function Slider({
  ref,
  className,
  style,
  orientation,
  size,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  getValueText,
  name,
  form,
  disabled: disabledProp,
  onKeyDown,
  onPointerDown,
  ...props
}: SliderProps) {
  // In a Field, the slider is named by the FieldLabel through aria-labelledby, since a <label for>
  // can only name native controls.
  const field = useField();
  const fieldProps = useFieldControlProps(props);
  const disabled = disabledProp ?? field?.disabled ?? false;
  const labelledBy = props["aria-labelledby"] ?? (field?.hasLabel ? field.labelId : undefined);
  const vertical = orientation === "vertical";

  // Rounds to the nearest step from `min` and into the range. Rounding to the step's decimals
  // keeps 0.1 + 0.2 from becoming 0.30000000000000004.
  function snap(raw: number) {
    const stepped = Math.round((raw - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    return Number(clamped.toFixed(Math.max(decimals(step), decimals(min))));
  }

  const [uncontrolledValue, setUncontrolledValue] = useState(() => snap(defaultValue ?? min));
  const controlled = valueProp !== undefined;
  const value = controlled ? Math.min(max, Math.max(min, valueProp)) : uncontrolledValue;
  const ratio = max > min ? (value - min) / (max - min) : 0;

  const rootRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);

  // A drag's pointer listeners live on the window for its whole length, so they read the latest
  // value and callbacks through refs rather than the render they started in.
  const latest = useRef(value);
  const changeRef = useRef(change);
  const commitRef = useRef(onValueCommit);
  const endDrag = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    latest.current = value;
    changeRef.current = change;
    commitRef.current = onValueCommit;
  });
  useEffect(() => () => endDrag.current?.(), []);

  function change(raw: number) {
    const next = snap(raw);
    if (next === latest.current) return;
    latest.current = next;
    if (!controlled) setUncontrolledValue(next);
    onValueChange?.(next);
  }

  // Like a native range input, an uncontrolled Slider goes back to its defaultValue when its form resets.
  useFormReset(rootRef, form, () => {
    if (!controlled) setUncontrolledValue(snap(defaultValue ?? min));
  });

  // The value under a pointer. The thumb's centre travels the length less the thumb's size, so a
  // press on either end's half-thumb picks that end.
  function valueAt(clientX: number, clientY: number) {
    const rect = rootRef.current!.getBoundingClientRect();
    const thumb = thumbRef.current?.offsetWidth ?? 0;
    const offset = vertical ? rect.bottom - clientY - thumb / 2 : clientX - rect.left - thumb / 2;
    const length = (vertical ? rect.height : rect.width) - thumb;
    const position = length > 0 ? Math.min(1, Math.max(0, offset / length)) : 0;
    return min + position * (max - min);
  }

  return (
    <div
      data-slot="slider"
      data-orientation={vertical ? "vertical" : "horizontal"}
      role="slider"
      tabIndex={disabled ? undefined : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={getValueText?.(value)}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      aria-disabled={disabled || undefined}
      className={cn(sliderVariants({ orientation, size }), className)}
      style={{ "--kl-slider-ratio": ratio, ...style } as CSSProperties}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled) return;
        const pageStep = largeStep ?? Math.max(step, Math.round((max - min) / 10 / step) * step);
        let next: number;
        switch (event.key) {
          case "ArrowRight":
          case "ArrowUp":
            next = value + step;
            break;
          case "ArrowLeft":
          case "ArrowDown":
            next = value - step;
            break;
          case "PageUp":
            next = value + pageStep;
            break;
          case "PageDown":
            next = value - pageStep;
            break;
          case "Home":
            next = min;
            break;
          case "End":
            next = max;
            break;
          default:
            return;
        }
        // The keys would otherwise scroll the page.
        event.preventDefault();
        next = snap(next);
        if (next === value) return;
        change(next);
        onValueCommit?.(next);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled || event.button !== 0) return;
        // Stops the press selecting text or moving focus elsewhere; the slider takes focus itself,
        // so the arrow keys work straight after.
        event.preventDefault();
        event.currentTarget.focus();
        endDrag.current?.();
        change(valueAt(event.clientX, event.clientY));

        const { pointerId } = event;
        const move = (moveEvent: PointerEvent) => {
          if (moveEvent.pointerId !== pointerId) return;
          changeRef.current(valueAt(moveEvent.clientX, moveEvent.clientY));
        };
        const finish = (endEvent: PointerEvent) => {
          if (endEvent.pointerId !== pointerId) return;
          endDrag.current?.();
          commitRef.current?.(latest.current);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", finish);
        window.addEventListener("pointercancel", finish);
        endDrag.current = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", finish);
          window.removeEventListener("pointercancel", finish);
          endDrag.current = null;
        };
      }}
      {...props}
      {...fieldProps}
      aria-labelledby={labelledBy}
      ref={mergedRef}
    >
      <span data-slot="slider-track" className={sliderTrackVariants({ orientation })}>
        <span data-slot="slider-range" className={sliderRangeVariants({ orientation })} />
      </span>
      <span data-slot="slider-thumb" ref={thumbRef} className={sliderThumbVariants({ orientation })} />
      {/* A slider always has a value, so there's nothing to validate: a hidden input carries it. */}
      {name !== undefined && <input type="hidden" name={name} form={form} disabled={disabled} value={value} />}
    </div>
  );
}
