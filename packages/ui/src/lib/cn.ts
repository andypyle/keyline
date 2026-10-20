import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  prefix: "kl",
  // Teach tailwind-merge the theme's named font sizes, so kl:text-body is a size, not a color.
  extend: { theme: { text: ["body", "prose", "h1", "h2", "h3", "h4", "display"] } },
  // Theme font sizes don't set line-height, so a text-* size must not remove a leading-* class.
  override: { conflictingClassGroups: { "font-size": [] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
