import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  [
    "kl:block",
    "kl:w-full",
    "kl:min-w-0",
    // Keyline ships without a CSS reset, so clear the browser's default input margin and font.
    "kl:m-0",
    "kl:font-body",
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
      // Heights match Button's, so an Input and a Button line up in a row.
      size: {
        sm: ["kl:h-9", "kl:px-3", "kl:text-sm", "kl:border-2"],
        md: ["kl:h-11.5", "kl:px-4", "kl:text-base", "kl:border-3"],
        lg: ["kl:h-14.5", "kl:px-5", "kl:text-lg", "kl:border-3"],
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

export type InputVariantProps = VariantProps<typeof inputVariants>;
