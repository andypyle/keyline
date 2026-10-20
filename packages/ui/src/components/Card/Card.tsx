import { cn } from "../../lib/cn";
import type { CardProps } from "./Card.types";
import { cardVariants } from "./Card.variants";

/**
 * Groups content about one subject, optionally linking to it as a whole. Compose it from the Card
 * parts: CardImage, then a CardBody holding CardTitle, CardDescription, CardTags and CardAction.
 * A CardAction makes the whole card clickable, so don't put other links or buttons inside.
 */
export function Card({ className, flat, noBorders, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ flat, noBorders }), className)} {...props} />;
}
