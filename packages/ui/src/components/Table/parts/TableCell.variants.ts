import { cva, type VariantProps } from "class-variance-authority";

// Shared by TableCell and TableHead. Every cell paints its own background and rules: the table's
// borders are separated, not collapsed, so a sticky cell carries them along as it sticks.
//
// Every rule is in `line`, like the outline. Weight carries the structure: 2px between rows, 3px
// (the outline's width) under the header, above the footer and along a frozen column. TableCaption's
// rule is 3px too.
//
// The Table marks itself data-no-row-borders, which drops the rules between body rows only, and
// data-sticky-header and data-sticky-column. Header cells stick to the top
// of its scroll container, and the first cell of every row sticks to the start edge, with a full
// rule on the edge it scrolls under. The corner cell sits above both.
export const tableCellVariants = cva(
  [
    "kl:px-4",
    "kl:py-3",
    "kl:bg-surface",
    "kl:border-b-2",
    "kl:border-line",
    "kl:in-data-sticky-column:first:sticky",
    "kl:in-data-sticky-column:first:inset-s-0",
    "kl:in-data-sticky-column:first:z-10",
    "kl:in-data-sticky-column:first:border-e-3",
  ],
  {
    variants: {
      /** Aligns the content to the start, center or end of the cell. Use `end` for numbers. */
      align: {
        start: ["kl:text-start"],
        center: ["kl:text-center"],
        end: ["kl:text-end"],
      },
      /** The row group the cell is in, read from TableHeader, TableBody or TableFooter. */
      section: {
        header: [
          "kl:bg-sunken",
          "kl:border-b-3",
          "kl:in-data-sticky-header:sticky",
          "kl:in-data-sticky-header:top-0",
          "kl:in-data-sticky-header:z-10",
          "kl:in-data-sticky-column:first:z-20",
        ],
        body: ["kl:in-data-no-row-borders:border-b-0", "kl:in-[tr:last-child]:border-b-0"],
        footer: [
          "kl:bg-sunken",
          "kl:in-[tr:first-child]:border-t-3",
          "kl:in-[tr:last-child]:border-b-0",
        ],
      },
    },
    defaultVariants: {
      align: "start",
      section: "body",
    },
  },
);

export type TableCellVariantProps = VariantProps<typeof tableCellVariants>;
