import { cva, type VariantProps } from "class-variance-authority";

// The focused item is the highlighted one: pointer movement moves focus too (see DropdownMenuItem),
// so hover and keyboard never highlight two items at once. Keyboard focus also gets an outline.
export const dropdownMenuItemVariants = cva(
  [
    "kl:flex",
    "kl:shrink-0",
    "kl:items-center",
    "kl:gap-2.5",
    "kl:w-full",
    "kl:h-10",
    // Keyline ships without a CSS reset, so clear the browser's default button spacing.
    "kl:m-0",
    "kl:px-3",
    "kl:font-body",
    "kl:font-semibold",
    "kl:text-sm",
    "kl:leading-none",
    "kl:text-left",
    "kl:whitespace-nowrap",
    "kl:bg-transparent",
    "kl:border-0",
    "kl:rounded-md",
    "kl:transition-colors",
    "kl:duration-120",
    "kl:ease-out",
    "kl:cursor-pointer",
    "kl:select-none",
    "kl:focus:outline-none",
    "kl:focus-visible:outline-2",
    "kl:focus-visible:-outline-offset-2",
    "kl:focus-visible:outline-focus",
    "kl:aria-disabled:opacity-45",
    "kl:aria-disabled:cursor-not-allowed",
    "kl:motion-reduce:transition-none",
    "kl:[&_svg]:size-4",
    "kl:[&_svg]:shrink-0",
    "kl:[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: ["kl:text-fg-1", "kl:focus:bg-surface-hover"],
        // Fills like a danger Button once highlighted, so the action reads as destructive before it runs.
        danger: ["kl:text-fg-1", "kl:focus:bg-danger", "kl:focus:text-white"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type DropdownMenuItemVariantProps = VariantProps<typeof dropdownMenuItemVariants>;
