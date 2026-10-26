import { createContext, useContext, type RefObject } from "react";

/** What a Tooltip shares with its trigger and content. */
export interface TooltipContextValue {
  open: boolean;
  contentId: string;
  contentRef: RefObject<HTMLSpanElement | null>;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

/** Returns the enclosing Tooltip's state. Throws outside one, since the parts can't work alone. */
export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip parts must be rendered inside a Tooltip.");
  return context;
}

// Only one tooltip shows at a time, page-wide. Once one has shown, the next opens without waiting
// out its delay, so moving along a toolbar reads each tooltip in turn; the page cools down
// WARM_MS after the last one closes.
const WARM_MS = 300;
let active: { close: () => void } | null = null;
let warmUntil = 0;

/** Whether a tooltip is showing, or closed recently enough that the next should skip its delay. */
export function isTooltipWarm() {
  return active !== null || performance.now() < warmUntil;
}

/** Records that a tooltip has opened, closing whichever one was showing before it. */
export function claimTooltip(tooltip: { close: () => void }) {
  if (active && active !== tooltip) active.close();
  active = tooltip;
}

/** Records that a tooltip has closed, starting the cool-down. */
export function releaseTooltip(tooltip: { close: () => void }) {
  if (active !== tooltip) return;
  active = null;
  warmUntil = performance.now() + WARM_MS;
}
