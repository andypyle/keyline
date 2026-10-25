import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import { ToasterContext } from "@/lib/toaster-context";
import { useReflowAnimation } from "@/lib/use-reflow-animation";
import { Toast } from "@/components/Toast/Toast";
import { ToastAction } from "@/components/Toast/parts/ToastAction";
import { ToastDescription } from "@/components/Toast/parts/ToastDescription";
import { ToastTitle } from "@/components/Toast/parts/ToastTitle";
import type { ToastOptions, ToasterProps } from "./Toaster.types";
import { toasterListVariants, toasterVariants } from "./Toaster.variants";

interface ToastItem {
  id: string;
  options: ToastOptions;
  open: boolean;
}

/**
 * Shows toasts raised with `useToast()`. Wrap your app in one Toaster; anything inside it can call
 * `toast()` and `dismiss()`. The toasts stack in a corner or along an edge of the viewport, in a
 * region named by `label`.
 *
 * The region renders in the top layer, so toasts show above a Modal. Pressing `hotkey` (F8) moves
 * focus to it, and closing the focused toast puts focus back where it was.
 */
export function Toaster({
  ref,
  className,
  position,
  duration = 5000,
  limit = 3,
  label = "Notifications",
  closeLabel = "Dismiss",
  hotkey = "F8",
  children,
  onFocus,
  ...props
}: ToasterProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const baseId = useId();
  const count = useRef(0);
  const regionRef = useRef<HTMLElement>(null);
  const mergedRef = useMemo(() => mergeRefs(regionRef, ref), [ref]);
  // Where focus was before it entered the region, to return it there.
  const returnFocus = useRef<HTMLElement | null>(null);

  const toast = useCallback(
    (input: ToastOptions | string) => {
      const options = typeof input === "string" ? { title: input } : input;
      const id = `${baseId}-${++count.current}`;
      setItems((current) => {
        // Over the limit, close the oldest shown toasts. They stay listed until they've animated out.
        let excess = current.filter((item) => item.open).length + 1 - limit;
        const kept = current.map((item) => {
          if (excess <= 0 || !item.open) return item;
          excess--;
          return { ...item, open: false };
        });
        return [...kept, { id, options, open: true }];
      });
      return id;
    },
    [baseId, limit],
  );

  const dismiss = useCallback((id?: string) => {
    setItems((current) => current.map((item) => (id === undefined || item.id === id ? { ...item, open: false } : item)));
  }, []);

  const context = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const closeToast = (id: string) => {
    // The focused toast is about to leave the DOM, which would drop focus on the body.
    const region = regionRef.current;
    if (region?.contains(document.activeElement)) {
      const target = returnFocus.current;
      (target?.isConnected ? target : region).focus();
    }
    dismiss(id);
  };

  const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  // Show the region while it has toasts. A Modal opened since it was shown sits above it in the
  // top layer, so showing it again for a new toast puts the toasts back on top. It's still inert
  // while the modal is open, like everything outside the modal.
  const hasItems = items.length > 0;
  const newest = items.at(-1)?.id;
  useLayoutEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const shown = region.matches(":popover-open");
    if (!hasItems) {
      if (shown) region.hidePopover();
      return;
    }
    if (shown && document.querySelector(":modal")) region.hidePopover();
    if (!region.matches(":popover-open")) region.showPopover();
  }, [hasItems, newest]);

  // Toasts already shown glide aside for a new one, on the same timing as its slide-in (ease-bounce),
  // and close up when one leaves.
  const listRef = useRef<HTMLOListElement>(null);
  useReflowAnimation(listRef, { duration: 320, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });

  useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== hotkey || event.defaultPrevented) return;
      const region = regionRef.current;
      if (!region?.matches(":popover-open")) return;
      event.preventDefault();
      region.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey]);

  return (
    <ToasterContext value={context}>
      {children}
      <section
        data-slot="toaster"
        popover="manual"
        aria-label={label}
        tabIndex={-1}
        className={cn(toasterVariants({ position }), className)}
        onFocus={(event) => {
          onFocus?.(event);
          const from = event.relatedTarget;
          if (from instanceof HTMLElement && !event.currentTarget.contains(from)) returnFocus.current = from;
        }}
        {...props}
        ref={mergedRef}
      >
        <ol ref={listRef} data-slot="toaster-list" className={toasterListVariants({ position })}>
          {items.map(({ id, options, open }) => (
            <li key={id} data-reflow-id={id}>
              <Toast
                tone={options.tone}
                open={open}
                duration={options.duration ?? duration}
                closeLabel={closeLabel}
                onOpenChange={(next) => {
                  if (!next) closeToast(id);
                }}
                onExited={() => remove(id)}
              >
                <ToastTitle>{options.title}</ToastTitle>
                {options.description != null && <ToastDescription>{options.description}</ToastDescription>}
                {options.action && <ToastAction onClick={options.action.onClick}>{options.action.label}</ToastAction>}
              </Toast>
            </li>
          ))}
        </ol>
      </section>
    </ToasterContext>
  );
}
