import { useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Glides a list's children from where they were to where the latest render put them, so they move
 * aside for an item that's added and close the gap of one that's removed instead of jumping. It
 * measures each child after every render and plays the difference as a transform (FLIP). Children
 * are matched across renders by their `data-reflow-id`; ones without it, and new ones, don't move.
 * A glide that's interrupted carries on from where it had got to. Skipped with reduced motion.
 */
export function useReflowAnimation(listRef: RefObject<HTMLElement | null>, options: KeyframeAnimationOptions) {
  const tops = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previous = tops.current;
    const next = new Map<string, number>();

    for (const child of list.children) {
      if (!(child instanceof HTMLElement)) continue;
      const id = child.dataset.reflowId;
      if (!id) continue;
      // The rect includes any glide still playing, so take its offset out to get the layout spot.
      const shift = new DOMMatrixReadOnly(getComputedStyle(child).transform).m42;
      const top = child.getBoundingClientRect().top - shift;
      next.set(id, top);

      const from = previous.get(id);
      if (from === undefined || from === top || reduced) continue;
      // Before this render it showed at its old spot plus the current offset; start from there.
      for (const animation of child.getAnimations()) animation.cancel();
      child.animate([{ transform: `translateY(${from + shift - top}px)` }, { transform: "none" }], options);
    }

    tops.current = next;
  });
}
