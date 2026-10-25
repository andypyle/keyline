import { cva, type VariantProps } from "class-variance-authority";

// The container carries the outline and shadow, since a collapsed-border table can't be rounded.
// It also clips the header and footer fills to its corners, and scrolls a table too wide for it, or
// too tall for its maxHeight. It's the scroll container sticky cells stick to, and the size
// container TableCaption wraps its text to.
export const tableContainerVariants = cva(
  [
    "kl:@container/table",
    "kl:overflow-auto",
    "kl:max-w-full",
    "kl:bg-surface",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-lg",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-4",
    "kl:focus-visible:outline-focus",
  ],
  {
    variants: {
      /** Removes the shadow, keeping the outline. */
      flat: {
        true: [],
        false: ["kl:shadow-lg"],
      },
    },
    defaultVariants: {
      flat: false,
    },
  },
);

export const tableVariants = cva([
  "kl:caption-bottom",
  // Collapsed borders belong to the table and stay behind when a cell sticks; separated ones don't.
  "kl:border-separate",
  "kl:border-spacing-0",
  "kl:w-full",
  "kl:font-body",
  "kl:text-base",
  "kl:leading-snug",
  "kl:tabular-nums",
  "kl:text-fg-1",
]);

export type TableVariantProps = VariantProps<typeof tableContainerVariants>;
