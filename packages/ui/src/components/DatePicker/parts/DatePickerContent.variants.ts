import { cva, type VariantProps } from "class-variance-authority";

// Shares SelectContent's look and motion: a manual popover in the top layer, tethered to the
// DatePicker by its anchor name, flipping above the trigger when there's no room below. The browser
// hides closed popovers with display: none, so display is only set while open, and
// transition-discrete keeps the fade running through the switch.
export const datePickerContentVariants = cva(
  [
    "kl:box-border",
    "kl:inset-auto",
    "kl:[position-anchor:var(--kl-date-picker-anchor)]",
    "kl:[position-try-fallbacks:flip-block]",
    "kl:flex-col",
    "kl:gap-2",
    "kl:m-0",
    "kl:my-2",
    "kl:p-3",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-lg",
    "kl:outline-none",
    "kl:-translate-y-1",
    "kl:scale-95",
    "kl:shadow-md",
    "kl:opacity-0",
    "kl:transition-[opacity,translate,scale,display,overlay]",
    "kl:transition-discrete",
    "kl:duration-150",
    "kl:ease-out",
    "kl:open:flex",
    "kl:open:translate-y-0",
    "kl:open:scale-100",
    "kl:open:opacity-100",
    "kl:open:duration-320",
    "kl:open:ease-bounce",
    "kl:starting:open:-translate-y-1",
    "kl:starting:open:scale-95",
    "kl:starting:open:opacity-0",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      // Which edge of the trigger the calendar lines up with.
      align: {
        start: ["kl:origin-top-left", "kl:[position-area:block-end_span-inline-end]"],
        end: ["kl:origin-top-right", "kl:[position-area:block-end_span-inline-start]"],
      },
    },
    defaultVariants: {
      align: "start",
    },
  },
);

export type DatePickerContentVariantProps = VariantProps<typeof datePickerContentVariants>;

// Added to the ghost icon Buttons that page between months. They're marked aria-disabled at the
// ends of the range, rather than disabled, so a button that just paged to the end keeps focus.
export const datePickerNavVariants = cva([
  "kl:aria-disabled:opacity-45",
  "kl:aria-disabled:cursor-not-allowed",
  "kl:aria-disabled:hover:bg-transparent",
  "kl:aria-disabled:active:translate-none",
]);

// The cell behind a day. Days between a range's ends sit on a band, rounded at the ends, which
// runs unbroken across the row since the cells have no spacing.
export const datePickerDayCellVariants = cva([
  "kl:p-0",
  "kl:data-in-range:bg-surface-hover",
  "kl:data-range-start:rounded-s-md",
  "kl:data-range-end:rounded-e-md",
]);

// One day in the grid. Today gets a dashed outline, the selected day the control fill on a hard
// shadow. Unavailable days stay focusable, so the keyboard can move through them, but are dimmed
// and struck through.
//
// Keyline ships without a CSS reset, so clear the browser's default button spacing and font.
export const datePickerDayVariants = cva([
  "kl:box-border",
  "kl:inline-flex",
  "kl:items-center",
  "kl:justify-center",
  "kl:size-9",
  "kl:m-0",
  "kl:p-0",
  "kl:font-body",
  "kl:font-semibold",
  "kl:text-sm",
  "kl:leading-none",
  "kl:tabular-nums",
  "kl:bg-transparent",
  "kl:text-fg-1",
  "kl:border-2",
  "kl:border-transparent",
  "kl:rounded-md",
  "kl:transition-colors",
  "kl:duration-120",
  "kl:ease-out",
  "kl:cursor-pointer",
  "kl:select-none",
  "kl:hover:bg-surface-hover",
  "kl:focus-visible:outline-3",
  "kl:focus-visible:outline-offset-1",
  "kl:focus-visible:outline-focus",
  "kl:aria-[current=date]:border-dashed",
  "kl:aria-[current=date]:border-line",
  "kl:aria-disabled:line-through",
  "kl:aria-disabled:opacity-45",
  "kl:aria-disabled:cursor-not-allowed",
  "kl:aria-disabled:hover:bg-transparent",
  "kl:data-selected:bg-control",
  "kl:data-selected:text-on-control",
  "kl:data-selected:border-solid",
  "kl:data-selected:border-line",
  "kl:data-selected:shadow-sm",
  "kl:data-selected:hover:bg-control-hover",
  "kl:motion-reduce:transition-none",
]);
