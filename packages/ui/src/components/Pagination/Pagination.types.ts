import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import type { PaginationItemVariantProps } from "./Pagination.variants";

export interface PaginationProps extends ComponentPropsWithRef<"nav">, PaginationItemVariantProps {
  /** How many pages there are. Below 1, it shows a single page. */
  pageCount: number;
  /** The current page, from 1, to control it. Pair it with `onPageChange`. */
  page?: number;
  /** The page shown at first, when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  /**
   * Called with the new page when a page, Previous or Next is clicked. With `getHref`, the link
   * still navigates; call `event.preventDefault()` to route on the client instead.
   */
  onPageChange?: (page: number, event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Pages shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Pages always shown at the start and at the end. Defaults to 1. */
  boundaryCount?: number;
  /** Renders each page as a link to the URL this returns, instead of a button. */
  getHref?: (page: number) => string;
  /** The accessible name of each page number. Defaults to `Page 3`; keep the number in it. */
  getPageLabel?: (page: number) => string;
  /** The Previous control's label, hidden on phones but still read out. Defaults to "Previous". */
  previousLabel?: ReactNode;
  /** The Next control's label, hidden on phones but still read out. Defaults to "Next". */
  nextLabel?: ReactNode;
}
