import { cn } from "@/lib/cn";
import type { CardActionButtonProps, CardActionProps } from "./CardAction.types";
import { cardActionFaceVariants, cardActionVariants } from "./CardAction.variants";

/**
 * The Card's call to action; a click anywhere on the Card activates it. Renders a link when given
 * `href`, otherwise a button. Its label is the card's only accessible name for the click, so make
 * it specific ("Read the Keyline case study", not "Read more"), or point `aria-describedby` at the
 * CardTitle.
 */
export function CardAction({ className, variant, children, ...props }: CardActionProps) {
  const classes = cn(cardActionVariants(), className);
  const face = (
    <span data-slot="card-action-face" className={cardActionFaceVariants({ variant })}>
      {children}
    </span>
  );

  if (props.href !== undefined) {
    return (
      <a data-slot="card-action" className={classes} {...props}>
        {face}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as CardActionButtonProps;
  return (
    <button data-slot="card-action" type={type} className={classes} {...buttonProps}>
      {face}
    </button>
  );
}
