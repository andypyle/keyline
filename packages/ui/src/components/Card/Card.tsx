import { useCardGridItem } from "../../lib/card-grid-context";
import { cn } from "../../lib/cn";
import type { CardProps } from "./Card.types";
import { cardLayoutVariants, cardVariants } from "./Card.variants";

/**
 * Groups content about one subject, optionally linking to it as a whole. Compose it from the Card
 * parts: CardImage, then a CardBody holding CardTitle, CardDescription, CardTags and CardAction.
 * A CardAction makes the whole card clickable, so don't put other links or buttons inside.
 *
 * A `horizontal` card places its CardImage beside the CardBody once the card is wide enough, with
 * the body aligned to the edge away from the image, and stacks them like a vertical card when it
 * isn't. `reversed` puts the image on the right. It sizes to its container, not its content, so
 * give it a width (a CardGrid cell, a block, or an explicit width) rather than putting it in an
 * inline or shrink-to-fit context.
 */
export function Card({ className, flat, noBorders, children, ...props }: CardProps) {
  // A one-column CardGrid lays its cards out horizontally, alternating sides.
  const item = useCardGridItem();
  const { orientation = item?.orientation, reversed = item?.reversed, ...rest } = props;
  const horizontal = orientation === "horizontal";
  return (
    <div
      data-slot="card"
      data-orientation={horizontal ? "horizontal" : "vertical"}
      data-reversed={horizontal ? Boolean(reversed) : undefined}
      className={cn(cardVariants({ flat, noBorders, orientation }), className)}
      {...rest}
    >
      {/* Container queries can't restyle the container itself, so a horizontal card lays its parts out in here. */}
      {horizontal ? (
        <div data-slot="card-layout" className={cardLayoutVariants({ reversed })}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
