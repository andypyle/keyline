let locks = 0;
let restore: (() => void) | undefined;

/**
 * Stops the page scrolling behind a modal. Returns a function that releases this lock; the page
 * scrolls again once every lock is released, so stacked modals can each hold one.
 */
export function lockScroll() {
  if (locks++ === 0) {
    const html = document.documentElement;
    const { overflow, paddingRight } = html.style;
    // Hiding the scrollbar widens the page, so pad it by the scrollbar's width to keep the
    // content from shifting sideways.
    const scrollbar = window.innerWidth - html.clientWidth;
    if (scrollbar > 0) html.style.paddingRight = `calc(${getComputedStyle(html).paddingRight} + ${scrollbar}px)`;
    html.style.overflow = "hidden";
    restore = () => {
      html.style.overflow = overflow;
      html.style.paddingRight = paddingRight;
    };
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) restore?.();
  };
}
