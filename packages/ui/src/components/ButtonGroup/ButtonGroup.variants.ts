import { cva, type VariantProps } from "class-variance-authority";

// The group is one block on one hard shadow. Its radius is shared with the outer corners of the
// first and last buttons through --kl-button-group-radius.
export const buttonGroupVariants = cva(["kl:isolate", "kl:inline-flex", "kl:rounded-(--kl-button-group-radius)"], {
  variants: {
    orientation: {
      horizontal: ["kl:flex-row"],
      vertical: ["kl:flex-col"],
    },
    size: {
      sm: [],
      md: [],
      lg: [],
      icon: [],
    },
    // Ghost buttons have no borders or shadow, so a ghost group has no shadow either.
    raised: {
      true: [],
      false: [],
    },
    radius: {
      full: ["kl:[--kl-button-group-radius:calc(infinity*1px)]"],
      sm: ["kl:[--kl-button-group-radius:var(--kl-radius-sm)]"],
      md: ["kl:[--kl-button-group-radius:var(--kl-radius-md)]"],
      lg: ["kl:[--kl-button-group-radius:var(--kl-radius-lg)]"],
      xl: ["kl:[--kl-button-group-radius:var(--kl-radius-xl)]"],
    },
  },
  // Matches the shadow a standalone Button of the same size rests on.
  compoundVariants: [
    { raised: true, size: ["sm", "icon"], class: ["kl:shadow-sm"] },
    { raised: true, size: ["md", "lg"], class: ["kl:shadow-md"] },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
    radius: "full",
    raised: true,
  },
});

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;

// Applied to each Button inside a group, after its own classes, so these win the merge. Buttons go
// flat (the group owns the shadow), neighboring borders collapse into one, and only the outer
// corners are rounded. Pressing nudges the label down 1px instead of moving the button.
//
// Disabled buttons can't fade with opacity here, because their borders are the group's outline and
// dividers. Instead they stay opaque and a page-colored overlay inside the borders fades the fill
// and label by the same amount.
export const buttonGroupItemVariants = cva(
  [
    "kl:relative",
    "kl:rounded-none",
    "kl:shadow-none",
    "kl:enabled:hover:translate-none",
    "kl:enabled:hover:shadow-none",
    "kl:enabled:aria-expanded:not-active:translate-none",
    "kl:enabled:aria-expanded:not-active:shadow-none",
    "kl:enabled:active:translate-none",
    "kl:enabled:active:pt-0.5",
    "kl:focus-visible:z-10",
    "kl:disabled:opacity-100",
    "kl:disabled:after:absolute",
    "kl:disabled:after:inset-0",
    "kl:disabled:after:bg-page/55",
    "kl:disabled:after:rounded-[inherit]",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "kl:not-first:border-s-0",
          "kl:first:rounded-s-(--kl-button-group-radius)",
          "kl:last:rounded-e-(--kl-button-group-radius)",
        ],
        vertical: [
          "kl:not-first:border-t-0",
          "kl:first:rounded-t-(--kl-button-group-radius)",
          "kl:last:rounded-b-(--kl-button-group-radius)",
        ],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
