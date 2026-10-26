import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { TransitionEvent } from "react";
import { useAccordionItem } from "@/lib/accordion-context";
import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import type { AccordionContentProps } from "./AccordionContent.types";

/**
 * Whether the element has a transition that will run. Reduced motion sets `transition-property:
 * none` and leaves the duration as it was, so both are checked.
 */
function hasTransition(element: HTMLElement) {
  const style = getComputedStyle(element);
  if (style.transitionProperty === "none") return false;
  return style.transitionDuration.split(",").some((duration) => parseFloat(duration) > 0);
}

/**
 * Content of an AccordionItem, shown while it's open. Put it after the AccordionTrigger. It's a
 * region labelled by the trigger. Props, including `ref` and `className`, go to the region.
 *
 * Its height animates by transitioning a grid row between 0fr and 1fr, which resolves to the
 * content's natural height in every current browser. Opening shows the content before expanding
 * it; closing collapses it, then hides it once the transition ends. While closed it's
 * `hidden="until-found"`, which keeps it out of the accessibility tree and the Tab order while
 * letting find-in-page match it and open the item. Browsers without until-found treat it as
 * plain `hidden`.
 */
export function AccordionContent({ ref, className, children, onTransitionEnd, onTransitionCancel, ...props }: AccordionContentProps) {
  const item = useAccordionItem();
  const localRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(localRef, ref), [ref]);
  // Rendered and laid out (not hidden). Stays true through the close transition.
  const [present, setPresent] = useState(item.open);
  // Grown to its full height. Lags `present` by one layout when opening, so the change transitions.
  const [expanded, setExpanded] = useState(item.open);

  useLayoutEffect(() => {
    if (item.open) setPresent(true);
    else setExpanded(false);
  }, [item.open]);

  useLayoutEffect(() => {
    const element = localRef.current!;
    if (item.open && present && !expanded) {
      // Lay it out collapsed first; otherwise it would appear at full height without transitioning.
      element.getBoundingClientRect();
      setExpanded(true);
    } else if (!item.open && present && !expanded && !hasTransition(element)) {
      // With no transition to wait for (reduced motion), hide it straight away.
      setPresent(false);
    }
  }, [item.open, present, expanded]);

  // React only renders `hidden` as a boolean, so until-found is set here.
  useLayoutEffect(() => {
    const element = localRef.current!;
    if (present) element.removeAttribute("hidden");
    else element.setAttribute("hidden", "until-found");
  }, [present]);

  // Find-in-page matched text inside: the browser has revealed the content, so open the item.
  useEffect(() => {
    const element = localRef.current!;
    const onBeforeMatch = () => flushSync(() => item.setOpen(true));
    element.addEventListener("beforematch", onBeforeMatch);
    return () => element.removeEventListener("beforematch", onBeforeMatch);
  }, [item]);

  function finishClosing(event: TransitionEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !item.open) setPresent(false);
  }

  return (
    <div
      ref={mergedRef}
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      data-slot="accordion-content"
      data-state={expanded ? "open" : "closed"}
      // Closed content isn't hidden until hydration, so it's inert as well.
      inert={!item.open || undefined}
      className={cn(
        [
          "kl:grid",
          "kl:grid-rows-[0fr]",
          "kl:text-base",
          "kl:leading-body",
          "kl:text-fg-2",
          "kl:transition-[grid-template-rows]",
          "kl:duration-200",
          "kl:ease-out",
          "kl:data-[state=open]:grid-rows-[1fr]",
          "kl:motion-reduce:transition-none",
        ],
        className,
      )}
      onTransitionEnd={(event) => {
        onTransitionEnd?.(event);
        finishClosing(event);
      }}
      onTransitionCancel={(event) => {
        onTransitionCancel?.(event);
        finishClosing(event);
      }}
      {...props}
    >
      <div className={cn(["kl:overflow-hidden", "kl:min-h-0"])}>
        {/* The top padding keeps the text off the trigger's hover fill, which still shows just after a click opens the item. */}
        <div className={cn(["kl:px-5", "kl:pt-1", "kl:pb-5"])}>{children}</div>
      </div>
    </div>
  );
}
