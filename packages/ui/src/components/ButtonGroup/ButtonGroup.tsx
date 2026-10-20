import { useMemo } from "react";
import { ButtonGroupContext } from "../../lib/button-group-context";
import { cn } from "../../lib/cn";
import type { ButtonGroupProps } from "./ButtonGroup.types";
import { buttonGroupVariants } from "./ButtonGroup.variants";

/**
 * Joins related buttons into a single control. Children should be Buttons only, since the first
 * and last child take the outer corners. Give the group an `aria-label` describing the set.
 */
export function ButtonGroup({
  className,
  orientation,
  size,
  radius,
  variant,
  ...props
}: ButtonGroupProps) {
  const resolvedOrientation = orientation ?? "horizontal";
  const context = useMemo(
    () => ({ orientation: resolvedOrientation, size, variant }),
    [resolvedOrientation, size, variant],
  );

  return (
    <ButtonGroupContext value={context}>
      <div
        data-slot="button-group"
        data-orientation={resolvedOrientation}
        role="group"
        className={cn(
          buttonGroupVariants({
            orientation: resolvedOrientation,
            size,
            raised: variant !== "ghost",
            // Pills read badly when stacked, so vertical groups default to a token radius.
            radius: radius ?? (resolvedOrientation === "vertical" ? "lg" : "full"),
          }),
          className,
        )}
        {...props}
      />
    </ButtonGroupContext>
  );
}
