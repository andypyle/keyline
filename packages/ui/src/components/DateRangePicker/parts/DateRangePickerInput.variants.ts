import { cva, type VariantProps } from "class-variance-authority";

// The box around the two fields, drawn like an Input: same sizes, borders and invalid state, with
// room at the end for DatePicker's calendar button. The fields inside draw nothing, so the box
// takes the focus ring while either has focus; the button rings itself.
//
// Keyline ships without a CSS reset, so box-border is what keeps w-full from adding the padding
// and border on top of the container's width.
export const dateRangePickerInputVariants = cva(
  [
    "kl:box-border",
    "kl:flex",
    "kl:items-center",
    "kl:gap-2",
    "kl:w-full",
    "kl:min-w-0",
    "kl:m-0",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-line",
    "kl:has-[input:focus-visible]:outline-3",
    "kl:has-[input:focus-visible]:outline-offset-2",
    "kl:has-[input:focus-visible]:outline-focus",
    "kl:has-[input[aria-invalid=true]]:border-danger",
    "kl:has-[input:disabled]:opacity-45",
  ],
  {
    variants: {
      // Heights match Input's and Button's, so they line up in a row.
      size: {
        sm: ["kl:h-9", "kl:pr-9", "kl:pl-3", "kl:text-sm", "kl:border-2"],
        md: ["kl:h-11.5", "kl:pr-11", "kl:pl-4", "kl:text-base", "kl:border-3"],
        lg: ["kl:h-14.5", "kl:pr-13", "kl:pl-5", "kl:text-lg", "kl:border-3"],
      },
      radius: {
        full: ["kl:rounded-full"],
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
    },
    defaultVariants: {
      size: "md",
      radius: "md",
    },
  },
);

export type DateRangePickerInputVariantProps = VariantProps<typeof dateRangePickerInputVariants>;

// One of the two text fields inside the box. Its width is set to fit the locale's date format, so
// the dates sit together around the dash; it shrinks in a narrow box. Inputs don't inherit their
// font, so it's set here, with even digits so every date fits the same width.
export const dateRangePickerFieldVariants = cva([
  "kl:box-border",
  "kl:flex-initial",
  "kl:min-w-0",
  "kl:h-full",
  "kl:m-0",
  "kl:p-0",
  "kl:[font:inherit]",
  "kl:tabular-nums",
  "kl:bg-transparent",
  "kl:text-fg-1",
  "kl:border-0",
  "kl:outline-none",
  "kl:placeholder:text-fg-3",
  "kl:disabled:cursor-not-allowed",
]);
