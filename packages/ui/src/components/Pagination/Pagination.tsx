import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { paginationRange } from "@/lib/pagination-range";
import type { PaginationProps } from "./Pagination.types";
import {
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationListVariants,
  paginationStepLabelVariants,
} from "./Pagination.variants";

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const defaultPageLabel = (page: number) => `Page ${page}`;

interface ItemProps {
  /** The page this control goes to. */
  target: number;
  current?: boolean;
  disabled?: boolean;
  step?: boolean;
  label?: string;
  className: string;
  children: ReactNode;
}

/**
 * Moves between the pages of a paged set: Previous, the page numbers, and Next, inside a `<nav>`
 * landmark (named "Pagination" unless given an `aria-label`). The current page is marked
 * `aria-current="page"`. Long ranges collapse into ellipses around the current page, keeping the
 * same number of controls wherever it is, so they don't shift under the pointer.
 *
 * Pages are buttons that call `onPageChange`, or with `getHref`, links. Previous and Next at
 * either end are `aria-disabled` rather than `disabled`, so a button that was just used to reach
 * the last page keeps focus. Control the page with `page` and `onPageChange`, or start
 * uncontrolled from `defaultPage`.
 */
export function Pagination({
  className,
  size,
  radius,
  pageCount: pageCountProp,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  getHref,
  getPageLabel = defaultPageLabel,
  previousLabel = "Previous",
  nextLabel = "Next",
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const pageCount = Math.max(1, Math.floor(pageCountProp));
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const controlled = pageProp !== undefined;
  const page = Math.min(Math.max(1, controlled ? pageProp : uncontrolledPage), pageCount);

  const goTo = (target: number, event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!controlled) setUncontrolledPage(target);
    onPageChange?.(target, event);
  };

  // A plain function rather than a component defined here, which React would remount on every
  // render, losing focus.
  const renderItem = ({ target, current = false, disabled = false, step = false, label, className, children }: ItemProps) => {
    const inert = current || disabled;
    const common = {
      "data-slot": step ? "pagination-step" : "pagination-page",
      "aria-label": label,
      "aria-current": current ? ("page" as const) : undefined,
      "aria-disabled": disabled || undefined,
      className,
      onClick: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (disabled) event.preventDefault();
        if (!inert) goTo(target, event);
      },
    };
    if (getHref) {
      // A disabled link has nowhere to go, so it loses its href; the role keeps it announced as a link.
      return (
        <a {...common} href={disabled ? undefined : getHref(target)} role={disabled ? "link" : undefined}>
          {children}
        </a>
      );
    }
    return (
      <button {...common} type="button">
        {children}
      </button>
    );
  };

  // Merged, so a step's padding replaces the size's.
  const itemClass = (variants: { current?: boolean; disabled?: boolean; step?: boolean }) =>
    cn(paginationItemVariants({ size, radius, ...variants }));

  return (
    <nav data-slot="pagination" aria-label={ariaLabel} className={className} {...props}>
      <ul data-slot="pagination-list" className={paginationListVariants({ size })}>
        <li>
          {renderItem({
            target: page - 1,
            step: true,
            disabled: page === 1,
            className: itemClass({ step: true, disabled: page === 1 }),
            children: (
              <>
                <Chevron d="M15 6l-6 6 6 6" />
                <span className={paginationStepLabelVariants()}>{previousLabel}</span>
              </>
            ),
          })}
        </li>
        {paginationRange({ page, pageCount, siblingCount, boundaryCount }).map((item) =>
          typeof item === "number" ? (
            // Keyed by page, so a clicked page keeps focus as it becomes the current one.
            <li key={item}>
              {renderItem({
                target: item,
                current: item === page,
                label: getPageLabel(item),
                className: itemClass({ current: item === page }),
                children: item,
              })}
            </li>
          ) : (
            // The page numbers either side say what's skipped, so the ellipsis is decoration.
            <li key={item} aria-hidden className={paginationEllipsisVariants({ size })}>
              …
            </li>
          ),
        )}
        <li>
          {renderItem({
            target: page + 1,
            step: true,
            disabled: page === pageCount,
            className: itemClass({ step: true, disabled: page === pageCount }),
            children: (
              <>
                <span className={paginationStepLabelVariants()}>{nextLabel}</span>
                <Chevron d="M9 6l6 6-6 6" />
              </>
            ),
          })}
        </li>
      </ul>
    </nav>
  );
}
