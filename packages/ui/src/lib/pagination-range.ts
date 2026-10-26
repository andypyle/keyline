/** A page number, or a gap of hidden pages before or after the current page's siblings. */
export type PaginationRangeItem = number | "start-ellipsis" | "end-ellipsis";

export interface PaginationRangeOptions {
  /** The current page, from 1. */
  page: number;
  /** How many pages there are. */
  pageCount: number;
  /** Pages shown on each side of the current page. */
  siblingCount: number;
  /** Pages always shown at the start and at the end. */
  boundaryCount: number;
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);
}

/**
 * The pages to show, in order, with an ellipsis for each run of hidden pages. The count stays the
 * same wherever the current page is, so the controls don't shift as the reader moves through
 * them: near either end, the pages the far ellipsis would have taken go to the near end instead.
 * An ellipsis only ever replaces two or more pages; a single hidden page is shown instead.
 */
export function paginationRange({ page, pageCount, siblingCount, boundaryCount }: PaginationRangeOptions) {
  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    (endPages[0] ?? pageCount + 1) - 2,
  );

  const items: PaginationRangeItem[] = [...startPages];
  if (siblingsStart > boundaryCount + 2) items.push("start-ellipsis");
  else if (boundaryCount + 1 < pageCount - boundaryCount) items.push(boundaryCount + 1);
  items.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < pageCount - boundaryCount - 1) items.push("end-ellipsis");
  else if (pageCount - boundaryCount > boundaryCount) items.push(pageCount - boundaryCount);
  items.push(...endPages);
  return items;
}
