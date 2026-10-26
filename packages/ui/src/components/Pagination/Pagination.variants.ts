import { cva, type VariantProps } from "class-variance-authority";

// The list of controls. It wraps rather than overflowing; on phones, Previous and Next shrink to
// their icons, and a lower siblingCount keeps a long range on one line.
export const paginationListVariants = cva(
  ["kl:flex", "kl:flex-wrap", "kl:items-center", "kl:m-0", "kl:p-0", "kl:list-none"],
  {
    variants: {
      size: {
        sm: ["kl:gap-2"],
        md: ["kl:gap-3", "kl:max-md:gap-2"],
        lg: ["kl:gap-3", "kl:max-md:gap-2"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Each page, Previous and Next: a link or a button with a Button's look, so the variants select
// on props rather than :enabled, which links never match. The current page is filled and doesn't
// respond to hover; Previous and Next at either end are faded and inert.
export const paginationItemVariants = cva(
  [
    "kl:inline-flex",
    "kl:items-center",
    "kl:justify-center",
    "kl:gap-2",
    // Buttons are border-box by default and links aren't, so size both the same way.
    "kl:box-border",
    // Keyline ships without a CSS reset, so clear the browser's default button spacing.
    "kl:m-0",
    "kl:font-body",
    "kl:font-bold",
    "kl:leading-none",
    "kl:tabular-nums",
    "kl:whitespace-nowrap",
    "kl:no-underline",
    "kl:border-line",
    "kl:transition-[translate,box-shadow,background-color]",
    "kl:duration-120",
    "kl:ease-out",
    "kl:select-none",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-2",
    "kl:focus-visible:outline-focus",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:shrink-0",
    "kl:[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      // On phones, every size takes sm's dimensions, so the shortest range (siblingCount 0) fits on
      // one line on a 320px screen.
      size: {
        sm: ["kl:h-9", "kl:min-w-9", "kl:px-1", "kl:text-sm", "kl:border-2", "kl:[&_svg]:size-4"],
        md: [
          "kl:h-11.5",
          "kl:min-w-11.5",
          "kl:px-1.5",
          "kl:text-base",
          "kl:border-3",
          "kl:[&_svg]:size-4.5",
          "kl:max-md:h-9",
          "kl:max-md:min-w-9",
          "kl:max-md:px-1",
          "kl:max-md:text-sm",
          "kl:max-md:border-2",
          "kl:max-md:[&_svg]:size-4",
        ],
        lg: [
          "kl:h-14.5",
          "kl:min-w-14.5",
          "kl:px-2",
          "kl:text-lg",
          "kl:border-3",
          "kl:[&_svg]:size-5",
          "kl:max-md:h-9",
          "kl:max-md:min-w-9",
          "kl:max-md:px-1",
          "kl:max-md:text-sm",
          "kl:max-md:border-2",
          "kl:max-md:[&_svg]:size-4",
        ],
      },
      // Pills by default, so page numbers are circles (up to three digits, given the tight padding); set a token radius to match a containing panel.
      radius: {
        full: ["kl:rounded-full"],
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
      // Previous and Next carry a label as well as an icon, so they take a Button's padding. On
      // phones the label is visually hidden and they square up around the icon.
      step: {
        true: ["kl:max-md:px-0"],
        false: [],
      },
      current: {
        true: ["kl:bg-accent", "kl:text-on-fill", "kl:cursor-default"],
        false: ["kl:bg-surface", "kl:text-fg-1", "kl:cursor-pointer"],
      },
      disabled: {
        true: ["kl:opacity-45", "kl:cursor-not-allowed"],
        false: [],
      },
    },
    // Shadow depth scales with size, and hover and press move like a Button's: hover lifts by half
    // the shadow's growth, pressing drops onto where the shadow was.
    compoundVariants: [
      { step: true, size: "sm", class: ["kl:px-3.5"] },
      { step: true, size: "md", class: ["kl:px-5"] },
      { step: true, size: "lg", class: ["kl:px-7"] },
      { disabled: false, size: "sm", class: ["kl:shadow-sm"] },
      { disabled: false, size: ["md", "lg"], class: ["kl:shadow-md", "kl:max-md:shadow-sm"] },
      {
        current: false,
        disabled: false,
        size: "sm",
        class: [
          "kl:hover:-translate-px",
          "kl:hover:bg-surface-hover",
          "kl:hover:shadow-[3px_3px_0_0_var(--kl-color-line)]",
          "kl:active:translate-0.5",
          "kl:active:shadow-none",
        ],
      },
      {
        current: false,
        disabled: false,
        size: ["md", "lg"],
        class: [
          "kl:hover:-translate-0.5",
          "kl:hover:bg-surface-hover",
          "kl:hover:shadow-lg",
          "kl:active:translate-1",
          "kl:active:shadow-none",
        ],
      },
      // md and lg are sm-sized on phones, so they move like sm there too.
      {
        current: false,
        disabled: false,
        size: ["md", "lg"],
        class: [
          "kl:max-md:hover:-translate-px",
          "kl:max-md:hover:shadow-[3px_3px_0_0_var(--kl-color-line)]",
          "kl:max-md:active:translate-0.5",
        ],
      },
    ],
    defaultVariants: {
      size: "md",
      radius: "full",
      step: false,
      current: false,
      disabled: false,
    },
  },
);

// Root-level props are only size and radius; the rest are set per item.
export type PaginationItemVariantProps = Pick<VariantProps<typeof paginationItemVariants>, "size" | "radius">;

// Hidden pages: the same footprint as a page number, so the row keeps its rhythm.
export const paginationEllipsisVariants = cva(
  ["kl:inline-flex", "kl:items-center", "kl:justify-center", "kl:font-body", "kl:font-bold", "kl:text-fg-2", "kl:select-none"],
  {
    variants: {
      size: {
        sm: ["kl:h-9", "kl:min-w-6", "kl:text-sm"],
        md: ["kl:h-11.5", "kl:min-w-7", "kl:text-base", "kl:max-md:h-9", "kl:max-md:min-w-6", "kl:max-md:text-sm"],
        lg: ["kl:h-14.5", "kl:min-w-8", "kl:text-lg", "kl:max-md:h-9", "kl:max-md:min-w-6", "kl:max-md:text-sm"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Previous and Next's labels, visually hidden on phones but still their accessible name.
export const paginationStepLabelVariants = cva(["kl:max-md:sr-only"]);
