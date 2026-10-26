import { cloneElement, isValidElement, type ReactElement } from "react";
import { Slot } from "@/lib/slot";
import { useTooltip } from "@/lib/tooltip-context";
import { Button } from "@/components/Button/Button";
import type { TooltipTriggerProps } from "./TooltipTrigger.types";

/**
 * Element that shows a Tooltip on hover or keyboard focus, described by the tooltip's text. It is
 * a Button, so it takes the same `variant`, `size`, `radius` and icons; an icon-only trigger still
 * needs an `aria-label`, since the tooltip describes the control rather than naming it. With
 * `asChild`, its one child becomes the trigger instead.
 */
export function TooltipTrigger({ asChild, children, "aria-describedby": describedBy, ...props }: TooltipTriggerProps) {
  const tooltip = useTooltip();
  const describe = (...ids: (string | undefined)[]) => [...ids, tooltip.contentId].filter(Boolean).join(" ");
  const triggerProps = { "data-slot": "tooltip-trigger", "data-state": tooltip.open ? "open" : "closed" };

  if (asChild) {
    if (!isValidElement(children)) throw new Error("A TooltipTrigger with asChild needs exactly one element as its child.");
    // Slot lets the child's props win, so fold the child's own description in with the tooltip's
    // before handing it over.
    const child = children as ReactElement<{ "aria-describedby"?: string }>;
    const described = cloneElement(child, { "aria-describedby": describe(describedBy, child.props["aria-describedby"]) });
    return (
      <Slot {...(props as object)} {...triggerProps}>
        {described}
      </Slot>
    );
  }

  return (
    <Button {...props} {...triggerProps} aria-describedby={describe(describedBy)}>
      {children}
    </Button>
  );
}
