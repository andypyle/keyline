import { cva, type VariantProps } from "class-variance-authority";

// Badges aren't interactive, so unlike Button they sit flat: no offset shadow, no hover.
export const badgeVariants = cva(
  [
    "kl:inline-flex",
    "kl:shrink-0",
    "kl:items-center",
    "kl:justify-center",
    "kl:font-body",
    "kl:font-semibold",
    "kl:leading-none",
    "kl:whitespace-nowrap",
    "kl:border-2",
    "kl:rounded-full",
    "kl:[&_svg]:shrink-0",
  ],
  {
    variants: {
      // Filled badges keep the line outline. Outline badges draw it in the tone's text color
      // (border-current), so each tone's text token has to clear 3:1 as a border as well as 4.5:1 as text.
      variant: {
        filled: ["kl:border-line"],
        outline: ["kl:bg-transparent", "kl:border-current"],
      },
      // Colors are set per variant in compoundVariants.
      tone: {
        neutral: [],
        accent: [],
        success: [],
        warning: [],
        danger: [],
        info: [],
      },
      size: {
        sm: ["kl:gap-1", "kl:h-5.5", "kl:px-2", "kl:text-xs", "kl:[&_svg]:size-3"],
        md: ["kl:gap-1.5", "kl:h-6.5", "kl:px-2.5", "kl:text-xs", "kl:[&_svg]:size-3.5"],
        lg: ["kl:gap-1.5", "kl:h-8", "kl:px-3", "kl:text-sm", "kl:[&_svg]:size-4"],
      },
    },
    compoundVariants: [
      { variant: "filled", tone: "neutral", class: ["kl:bg-neutral", "kl:text-on-neutral"] },
      { variant: "filled", tone: "accent", class: ["kl:bg-accent", "kl:text-on-fill"] },
      { variant: "filled", tone: "success", class: ["kl:bg-success-fill", "kl:text-on-fill"] },
      { variant: "filled", tone: "warning", class: ["kl:bg-warning", "kl:text-on-fill"] },
      // Rust and dusk are too dark for on-fill text, so these two take white.
      { variant: "filled", tone: "danger", class: ["kl:bg-danger", "kl:text-white"] },
      { variant: "filled", tone: "info", class: ["kl:bg-info", "kl:text-white"] },
      { variant: "outline", tone: "neutral", class: ["kl:text-fg-1"] },
      { variant: "outline", tone: "accent", class: ["kl:text-accent-strong"] },
      { variant: "outline", tone: "success", class: ["kl:text-success-text"] },
      { variant: "outline", tone: "warning", class: ["kl:text-warning-text"] },
      { variant: "outline", tone: "danger", class: ["kl:text-danger-text"] },
      { variant: "outline", tone: "info", class: ["kl:text-info-text"] },
    ],
    defaultVariants: {
      variant: "filled",
      tone: "accent",
      size: "md",
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
