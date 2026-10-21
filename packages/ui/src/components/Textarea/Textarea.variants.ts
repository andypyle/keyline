import { cva, type VariantProps } from "class-variance-authority";

// Matches Input's base, so the two sit together in a form.
export const textareaVariants = cva(
  [
    "kl:block",
    "kl:w-full",
    "kl:min-w-0",
    // Keyline ships without a CSS reset, so clear the browser's default textarea margin and font.
    "kl:m-0",
    "kl:font-body",
    "kl:leading-body",
    "kl:bg-surface",
    "kl:text-fg-1",
    "kl:border-line",
    "kl:placeholder:text-fg-3",
    "kl:read-only:bg-sunken",
    "kl:focus-visible:outline-3",
    "kl:focus-visible:outline-offset-2",
    "kl:focus-visible:outline-focus",
    "kl:aria-invalid:border-danger",
    "kl:disabled:opacity-45",
    "kl:disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: ["kl:min-h-20", "kl:px-3", "kl:py-2", "kl:text-sm", "kl:border-2"],
        md: ["kl:min-h-28", "kl:px-4", "kl:py-2.5", "kl:text-base", "kl:border-3"],
        lg: ["kl:min-h-36", "kl:px-5", "kl:py-3.5", "kl:text-lg", "kl:border-3"],
      },
      radius: {
        sm: ["kl:rounded-sm"],
        md: ["kl:rounded-md"],
        lg: ["kl:rounded-lg"],
        xl: ["kl:rounded-xl"],
      },
      // Grows with its content instead of scrolling; cap it with a max-h-* class. Browsers without
      // field-sizing keep the fixed height and scroll.
      autoResize: {
        true: ["kl:field-sizing-content", "kl:resize-none"],
        false: ["kl:resize-y"],
      },
    },
    defaultVariants: {
      size: "md",
      radius: "md",
      autoResize: false,
    },
  },
);

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
