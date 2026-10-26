import { cva, type VariantProps } from "class-variance-authority";

// A 2px rule in `line` separates each item from the one above, like a Table's rows.
//
// ::details-content wraps everything after the summary. Its height transitions between 0 and
// auto, which interpolate-size allows, and content-visibility switches discretely at the end of
// closing, so the content stays painted while it collapses. Browsers without ::details-content or
// interpolate-size open and close instantly.
export const accordionItemVariants = cva([
  "kl:border-line",
  "kl:[interpolate-size:allow-keywords]",
  "kl:not-first:border-t-2",
  "kl:details-content:overflow-clip",
  "kl:details-content:h-0",
  "kl:details-content:transition-[height,content-visibility]",
  "kl:details-content:transition-discrete",
  "kl:details-content:duration-200",
  "kl:details-content:ease-out",
  "kl:open:details-content:h-auto",
  "kl:motion-reduce:details-content:transition-none",
]);

export type AccordionItemVariantProps = VariantProps<typeof accordionItemVariants>;
