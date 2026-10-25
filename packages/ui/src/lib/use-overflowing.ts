import { type RefObject, useEffect, useState } from "react";

/**
 * Whether an element's content is wider or taller than the element, so it scrolls. Rechecks when
 * the element or any of its children resizes.
 */
export function useOverflowing(ref: RefObject<HTMLElement | null>) {
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const check = () =>
      setOverflowing(element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight);
    const observer = new ResizeObserver(check);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    return () => observer.disconnect();
  }, [ref]);
  return overflowing;
}
