import { cva, type VariantProps } from "class-variance-authority";

// CardAction is two layers. The outer link or button never moves: its ::after overlay stretches
// over the whole card as the click target, and a transform on it would make it the overlay's
// containing block, shrinking the overlay back onto the action mid-hover. For the same reason it
// must not be positioned. The inner face carries the Button look and lifts like a Button does.
//
// The overlay covers the card's border box (--kl-card-border past the padding box), plus
// --kl-card-lift past the bottom and right so a lifted card stays under the pointer.
export const cardActionVariants = cva([
  "kl:group/card-action",
  "kl:inline-flex",
  "kl:shrink-0",
  // Sits at the bottom right of the CardBody, so actions line up across a row of equal-height cards.
  "kl:self-end",
  "kl:m-0",
  "kl:mt-auto",
  "kl:p-0",
  "kl:no-underline",
  "kl:bg-transparent",
  "kl:border-0",
  "kl:rounded-(--kl-card-radius)",
  "kl:cursor-pointer",
  "kl:select-none",
  "kl:after:absolute",
  "kl:after:-inset-(--kl-card-border)",
  "kl:after:-right-[calc(var(--kl-card-border)+var(--kl-card-lift))]",
  "kl:after:-bottom-[calc(var(--kl-card-border)+var(--kl-card-lift))]",
  "kl:after:content-['']",
  "kl:focus-visible:outline-3",
  "kl:focus-visible:outline-offset-4",
  "kl:focus-visible:outline-focus",
  "kl:disabled:cursor-not-allowed",
]);

// Hover lands anywhere on the card, since the overlay belongs to the action. The face lifts by its
// shadow's growth, like a small Button, on top of the card's own lift.
export const cardActionFaceVariants = cva(
  [
    "kl:inline-flex",
    "kl:items-center",
    "kl:justify-center",
    "kl:gap-2",
    "kl:h-11.5",
    "kl:px-5",
    "kl:font-body",
    "kl:font-bold",
    "kl:text-base",
    "kl:leading-none",
    "kl:whitespace-nowrap",
    "kl:border-3",
    "kl:border-line",
    "kl:rounded-(--kl-card-radius)",
    "kl:shadow-sm",
    "kl:transition-[translate,box-shadow,background-color]",
    "kl:duration-200",
    "kl:ease-out",
    "kl:group-[:not(:disabled):hover]/card-action:-translate-px",
    "kl:group-[:not(:disabled):hover]/card-action:shadow-[3px_3px_0_0_var(--kl-color-line)]",
    "kl:group-[:not(:disabled):active]/card-action:translate-0.5",
    "kl:group-[:not(:disabled):active]/card-action:shadow-none",
    "kl:group-disabled/card-action:shadow-none",
    "kl:group-disabled/card-action:opacity-45",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:size-4.5",
    "kl:[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: ["kl:bg-accent", "kl:text-on-fill", "kl:group-[:not(:disabled):hover]/card-action:bg-accent-hover"],
        secondary: [
          "kl:bg-surface",
          "kl:text-fg-1",
          "kl:group-[:not(:disabled):hover]/card-action:bg-surface-hover",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export type CardActionVariantProps = VariantProps<typeof cardActionFaceVariants>;
