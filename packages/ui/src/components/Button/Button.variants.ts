import { cva, type VariantProps } from "class-variance-authority";

// Filled variants sit on a hard shadow; ghost doesn't.
const raised: ("primary" | "secondary" | "neutral" | "inverse" | "danger")[] = [
  "primary",
  "secondary",
  "neutral",
  "inverse",
  "danger",
];

export const buttonVariants = cva(
  [
    "kl:group/button",
    "kl:inline-flex",
    "kl:shrink-0",
    "kl:items-center",
    "kl:justify-center",
    "kl:gap-2",
    // Keyline ships without a CSS reset, so clear the browser's default button spacing.
    "kl:m-0",
    "kl:p-0",
    "kl:font-body",
    "kl:font-medium",
    "kl:leading-none",
    "kl:whitespace-nowrap",
    "kl:border-line",
    "kl:transition-[translate,box-shadow,background-color]",
    "kl:duration-120",
    "kl:ease-out",
    "kl:cursor-pointer",
    "kl:select-none",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-4",
    "kl:focus-visible:outline-focus",
    "kl:disabled:shadow-none",
    "kl:disabled:opacity-45",
    "kl:disabled:cursor-not-allowed",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:shrink-0",
    "kl:[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "kl:bg-accent",
          "kl:text-on-fill",
          "kl:enabled:hover:bg-accent-hover",
          "kl:enabled:aria-expanded:bg-accent-hover",
        ],
        secondary: [
          "kl:bg-surface",
          "kl:text-fg-1",
          "kl:enabled:hover:bg-surface-hover",
          "kl:enabled:aria-expanded:bg-surface-hover",
        ],
        neutral: [
          "kl:bg-neutral",
          "kl:text-on-neutral",
          "kl:enabled:hover:bg-neutral-hover",
          "kl:enabled:aria-expanded:bg-neutral-hover",
        ],
        inverse: [
          "kl:bg-inverse",
          "kl:text-fg-inverse",
          "kl:enabled:hover:bg-inverse-hover",
          "kl:enabled:aria-expanded:bg-inverse-hover",
        ],
        danger: [
          "kl:bg-danger",
          "kl:text-white",
          "kl:enabled:hover:bg-danger-hover",
          "kl:enabled:aria-expanded:bg-danger-hover",
        ],
        ghost: [
          "kl:bg-transparent",
          "kl:text-fg-1",
          "kl:border-transparent",
          "kl:enabled:hover:bg-sunken",
          "kl:enabled:aria-expanded:bg-sunken",
          "kl:enabled:active:translate-px",
        ],
      },
      size: {
        sm: ["kl:h-9", "kl:px-3.5", "kl:text-sm", "kl:border-2", "kl:[&_svg]:size-4"],
        md: ["kl:h-11.5", "kl:px-5", "kl:text-base", "kl:border-3", "kl:[&_svg]:size-4.5"],
        lg: ["kl:h-14.5", "kl:px-7", "kl:text-lg", "kl:border-3", "kl:[&_svg]:size-5"],
        icon: ["kl:size-9", "kl:text-base", "kl:border-2", "kl:[&_svg]:size-4.5"],
      },
      // Pills by default; set a token radius to match a containing card or panel.
      radius: {
        full: ["kl:rounded-full"],
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
    },
    // Shadow depth scales with size. Hover lifts by half the shadow's growth so its outer edge
    // stays put; pressing drops the button onto where the shadow was. A button whose popup is open
    // (aria-expanded) holds the hover look, so it doesn't drop when the pointer moves into the popup.
    compoundVariants: [
      {
        variant: raised,
        size: ["sm", "icon"],
        class: [
          "kl:shadow-sm",
          "kl:enabled:hover:-translate-px",
          "kl:enabled:hover:shadow-[3px_3px_0_0_var(--kl-color-line)]",
          "kl:enabled:aria-expanded:not-active:-translate-px",
          "kl:enabled:aria-expanded:not-active:shadow-[3px_3px_0_0_var(--kl-color-line)]",
          "kl:enabled:active:translate-0.5",
          "kl:enabled:active:shadow-none",
        ],
      },
      {
        variant: raised,
        size: ["md", "lg"],
        class: [
          "kl:shadow-md",
          "kl:enabled:hover:-translate-0.5",
          "kl:enabled:hover:shadow-lg",
          "kl:enabled:aria-expanded:not-active:-translate-0.5",
          "kl:enabled:aria-expanded:not-active:shadow-lg",
          "kl:enabled:active:translate-1",
          "kl:enabled:active:shadow-none",
        ],
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "full",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

// Wraps startIcon/endIcon. Each animation plays once when the button is hovered or gets keyboard
// focus; the keyframes live in theme.css as --animate-icon-*.
export const buttonIconVariants = cva(["kl:inline-flex", "kl:shrink-0", "kl:motion-reduce:animate-none!"], {
  variants: {
    animation: {
      none: [],
      dash: [],
      nudge: ["kl:group-hover/button:animate-icon-nudge", "kl:group-focus-visible/button:animate-icon-nudge"],
      hop: ["kl:group-hover/button:animate-icon-hop", "kl:group-focus-visible/button:animate-icon-hop"],
      spin: ["kl:group-hover/button:animate-icon-spin", "kl:group-focus-visible/button:animate-icon-spin"],
      close: ["kl:group-hover/button:animate-icon-close", "kl:group-focus-visible/button:animate-icon-close"],
    },
    position: {
      start: [],
      end: [],
    },
  },
  // Dash runs in the icon's direction of travel: back arrows lead, forward arrows trail.
  compoundVariants: [
    {
      animation: "dash",
      position: "start",
      class: ["kl:group-hover/button:animate-icon-dash-back", "kl:group-focus-visible/button:animate-icon-dash-back"],
    },
    {
      animation: "dash",
      position: "end",
      class: ["kl:group-hover/button:animate-icon-dash", "kl:group-focus-visible/button:animate-icon-dash"],
    },
  ],
  defaultVariants: {
    animation: "none",
    position: "start",
  },
});

export type ButtonIconVariantProps = VariantProps<typeof buttonIconVariants>;
