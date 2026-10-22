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

// Holds one of the two fields, sized to fit its widest text. The field and two invisible copies of
// that text (the placeholder and a full date) share the one grid cell, so the cell takes the
// width of the wider copy and the field fills it. Each date then sits as close to the arrow as the
// other, with no slack beyond what the placeholder's wider letters need, in any locale, font or
// size. It shrinks in a narrow box.
//
// The box is full width like other form controls, so the end field's slot grows into the space
// left after it: a click anywhere up to the calendar button lands in the end field.
export const dateRangePickerFieldSlotVariants = cva(["kl:inline-grid", "kl:min-w-0", "kl:h-full", "kl:tabular-nums"], {
  variants: {
    position: {
      start: ["kl:flex-initial"],
      end: ["kl:flex-1"],
    },
  },
  defaultVariants: {
    position: "start",
  },
});

// One of the invisible copies that size a field's slot. It takes no height, so only its width counts.
export const dateRangePickerFieldSizerVariants = cva([
  "kl:invisible",
  "kl:[grid-area:1/1]",
  "kl:h-0",
  "kl:overflow-hidden",
  "kl:whitespace-pre",
]);

// One of the two text fields, filling its slot. An input is about 20 characters wide by default,
// which would widen the slot past its text, so it takes no width of its own and stretches to the
// slot's. Inputs don't inherit their font, so it's set here, with even digits so every date is
// the same width as the copy that sizes it.
export const dateRangePickerFieldVariants = cva([
  "kl:box-border",
  "kl:[grid-area:1/1]",
  "kl:w-0",
  "kl:min-w-full",
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
