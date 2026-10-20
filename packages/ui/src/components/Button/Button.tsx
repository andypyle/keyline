import { cn } from "../../lib/cn";
import type { ButtonProps } from "./Button.types";
import { buttonIconVariants, buttonVariants } from "./Button.variants";

/** Triggers an action or event. */
export function Button({
  className,
  variant,
  size,
  radius,
  startIcon,
  endIcon,
  iconAnimation,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  // Disabled buttons don't respond to hover, so their icons shouldn't either.
  const animation = props.disabled ? "none" : iconAnimation;

  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, radius }), className)}
      {...props}
    >
      {startIcon && (
        <span data-slot="icon" data-position="start" aria-hidden className={buttonIconVariants({ animation, position: "start" })}>
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span data-slot="icon" data-position="end" aria-hidden className={buttonIconVariants({ animation, position: "end" })}>
          {endIcon}
        </span>
      )}
    </button>
  );
}
