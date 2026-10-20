import type { ComponentPropsWithRef } from "react";
import type { CardActionVariantProps } from "./CardAction.variants";

/** With `href`, CardAction renders a link and the card navigates. */
export interface CardActionLinkProps extends ComponentPropsWithRef<"a">, CardActionVariantProps {
  href: string;
}

/** Without `href`, CardAction renders a button and the card runs its `onClick`. */
export interface CardActionButtonProps extends ComponentPropsWithRef<"button">, CardActionVariantProps {
  href?: undefined;
}

export type CardActionProps = CardActionLinkProps | CardActionButtonProps;
