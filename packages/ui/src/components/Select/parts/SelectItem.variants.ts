import { cva, type VariantProps } from "class-variance-authority";

// Sized and spaced like DropdownMenuItem. Focus never leaves the trigger, so the highlighted option
// is marked with data-highlighted instead of :focus. Its value says what moved there: the keyboard
// also gets an outline, the pointer only the fill.
//
// Keyline ships without a CSS reset, so box-border is what keeps w-full from pushing the padding,
// and the check with it, past the list's edge. (DropdownMenuItem is a button, already border-box.)
export const selectItemVariants = cva([
  "kl:group/select-item",
  "kl:box-border",
  "kl:flex",
  "kl:shrink-0",
  "kl:items-center",
  "kl:gap-2.5",
  "kl:w-full",
  "kl:h-10",
  "kl:px-3",
  "kl:font-body",
  "kl:font-semibold",
  "kl:text-sm",
  "kl:leading-none",
  "kl:whitespace-nowrap",
  "kl:text-fg-1",
  "kl:rounded-md",
  "kl:transition-colors",
  "kl:duration-120",
  "kl:ease-out",
  "kl:cursor-pointer",
  "kl:select-none",
  "kl:aria-disabled:opacity-45",
  "kl:aria-disabled:cursor-not-allowed",
  "kl:data-highlighted:bg-surface-hover",
  "kl:data-[highlighted=keyboard]:outline-2",
  "kl:data-[highlighted=keyboard]:-outline-offset-2",
  "kl:data-[highlighted=keyboard]:outline-focus",
  "kl:motion-reduce:transition-none",
  "kl:[&_svg]:size-4",
  "kl:[&_svg]:shrink-0",
  "kl:[&_svg]:pointer-events-none",
]);

export type SelectItemVariantProps = VariantProps<typeof selectItemVariants>;
