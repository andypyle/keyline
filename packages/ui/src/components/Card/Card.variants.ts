import { cva, type VariantProps } from "class-variance-authority";

// The parts read three custom properties from here: --kl-card-radius rounds the card and its
// CardAction alike (set it to restyle both), --kl-card-border sizes the outline (CardImage matches
// its divider and inner radius to it), and --kl-card-lift is how far hover raises the card
// (CardAction stretches its overlay that far past the bottom and right edges, so a pointer resting
// there stays over the card while it's lifted).
export const cardVariants = cva(
  [
    "kl:[--kl-card-radius:var(--kl-radius-lg)]",
    "kl:[--kl-card-border:3px]",
    "kl:[--kl-card-lift:0px]",
    "kl:relative",
    "kl:flex",
    "kl:flex-col",
    "kl:min-w-0",
    "kl:font-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-(length:--kl-card-border)",
    "kl:border-line",
    "kl:rounded-(--kl-card-radius)",
    "kl:transition-[translate,box-shadow]",
    "kl:duration-200",
    "kl:ease-out",
    "kl:motion-reduce:transition-none",
  ],
  {
    variants: {
      /** Removes the shadow and the hover lift, keeping the outline. */
      flat: {
        true: [],
        false: [],
      },
      /** Removes the outline, and with it the shadow and the hover lift. */
      noBorders: {
        true: ["kl:[--kl-card-border:0px]"],
        false: [],
      },
      /**
       * `horizontal` makes the card the `card` container: the parts query its width (`@2xl/card:`)
       * to sit side by side. Vertical cards declare no container, so those queries never match.
       */
      orientation: {
        vertical: [],
        horizontal: ["kl:@container/card"],
      },
    },
    // Raised cards rest on shadow-lg, but only react when they hold an enabled CardAction, whose
    // overlay makes the whole card its click target. Hover and keyboard focus lift by the shadow's
    // growth so its outer edge stays put; pressing drops the card onto where the shadow was.
    compoundVariants: [
      {
        flat: false,
        noBorders: false,
        class: [
          "kl:[--kl-card-lift:2px]",
          "kl:shadow-lg",
          "kl:has-[[data-slot=card-action]:not(:disabled)]:hover:-translate-0.5",
          "kl:has-[[data-slot=card-action]:not(:disabled)]:hover:shadow-xl",
          "kl:has-[[data-slot=card-action]:not(:disabled):focus-visible]:-translate-0.5",
          "kl:has-[[data-slot=card-action]:not(:disabled):focus-visible]:shadow-xl",
          "kl:has-[[data-slot=card-action]:not(:disabled)]:active:translate-1.5",
          "kl:has-[[data-slot=card-action]:not(:disabled)]:active:shadow-none",
        ],
      },
    ],
    defaultVariants: {
      flat: false,
      noBorders: false,
      orientation: "vertical",
    },
  },
);

// The inner layout of a horizontal card: a column like a vertical card, then a row once the card
// is wide enough. It must not be positioned, so CardAction's overlay still covers the whole card.
//
// The parts mirror themselves for `reversed` by reading data-reversed on the card: the body aligns
// to the edge away from the image, and CardImage moves its divider and rounded corners across.
export const cardLayoutVariants = cva(["kl:flex", "kl:flex-1", "kl:flex-col"], {
  variants: {
    /** In a wide horizontal card, puts the image on the right and the body on the left. */
    reversed: {
      true: ["kl:@2xl/card:flex-row-reverse"],
      false: ["kl:@2xl/card:flex-row"],
    },
  },
  defaultVariants: {
    reversed: false,
  },
});

export type CardLayoutVariantProps = VariantProps<typeof cardLayoutVariants>;

export type CardVariantProps = VariantProps<typeof cardVariants>;
