import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import { ToastContext } from "@/lib/toast-context";
import { ToastCloseIcon, toastToneIcons } from "@/lib/toast-icons";
import { Button } from "@/components/Button/Button";
import type { ToastProps } from "./Toast.types";
import { toastIconVariants, toastVariants } from "./Toast.variants";

/**
 * Brief, non-blocking notification. Compose it from a ToastTitle, an optional ToastDescription and
 * an optional ToastAction. Most apps raise toasts with `useToast()` and let a Toaster render them;
 * render a Toast yourself only to place it somewhere else.
 *
 * It's a `role="status"` live region, so screen readers announce it without moving focus. It closes
 * itself after `duration`, pausing while it's hovered, focused or the page is hidden, and closes on
 * Escape while focus is inside it.
 */
export function Toast({
  ref,
  className,
  tone,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onExited,
  duration = 5000,
  icon,
  closeLabel = "Dismiss",
  noCloseButton,
  children,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onAnimationEnd,
  ...props
}: ToastProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, controlled, onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);

  // A closed toast stays rendered until its exit animation ends, then leaves the DOM.
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const finishExit = () => {
    setPresent(false);
    onExited?.();
  };

  // With reduced motion there's no exit animation to wait for, so leave right away.
  useEffect(() => {
    if (open || !present) return;
    if (rootRef.current?.getAnimations().length) return;
    finishExit();
  }, [open, present]);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const paused = hovered || focused || pageHidden;

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // The time left, carried across pauses. It's measured with performance.now(), which keeps
  // ticking when Date is mocked, and starts over whenever the toast opens or its duration changes.
  const remaining = useRef(duration);
  useEffect(() => {
    remaining.current = duration;
  }, [open, duration]);

  useEffect(() => {
    // setTimeout treats Infinity as 0, so a toast that should stay never starts a timer.
    if (!open || paused || !Number.isFinite(duration)) return;
    const start = performance.now();
    const timer = setTimeout(close, Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current -= performance.now() - start;
    };
  }, [open, paused, duration, close]);

  const context = useMemo(() => ({ close }), [close]);

  if (!present) return null;

  const shownIcon = icon === undefined ? toastToneIcons[tone ?? "neutral"] : icon;

  return (
    <ToastContext value={context}>
      <div
        data-slot="toast"
        data-state={open ? "open" : "closed"}
        role="status"
        aria-atomic="true"
        className={cn(toastVariants({ tone, noCloseButton }), className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.key !== "Escape") return;
          event.preventDefault();
          close();
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          setHovered(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovered(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setFocused(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        onAnimationEnd={(event) => {
          onAnimationEnd?.(event);
          // Animations inside, like the close button's icon, bubble up here too.
          if (event.target === event.currentTarget && !open) finishExit();
        }}
        {...props}
        ref={mergedRef}
      >
        {shownIcon != null && shownIcon !== false && (
          <span data-slot="toast-icon" aria-hidden className={toastIconVariants({ tone })}>
            {shownIcon}
          </span>
        )}
        <div data-slot="toast-content" className={cn(["kl:flex", "kl:flex-1", "kl:flex-col", "kl:gap-1", "kl:min-w-0", "kl:pt-1"])}>
          {children}
        </div>
        {!noCloseButton && (
          <Button
            data-slot="toast-close"
            variant="ghost"
            size="icon"
            iconAnimation="close"
            aria-label={closeLabel}
            startIcon={<ToastCloseIcon />}
            // The ghost hover fill is grey, which muddies a tinted panel; a wash of the text color
            // darkens any tint in light mode and lightens it in dark.
            className={cn(["kl:shrink-0", "kl:size-8", "kl:-my-1", "kl:enabled:hover:bg-current/10"])}
            onClick={close}
          />
        )}
      </div>
    </ToastContext>
  );
}
