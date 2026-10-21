import { Children, isValidElement } from "react";
import { CardGridItemContext, type CardGridItemContextValue } from "../../lib/card-grid-context";
import { cn } from "../../lib/cn";
import type { CardGridProps } from "./CardGrid.types";
import { cardGridItemsVariants, cardGridVariants } from "./CardGrid.variants";

const imageStart: CardGridItemContextValue = { orientation: "horizontal", reversed: false };
const imageEnd: CardGridItemContextValue = { orientation: "horizontal", reversed: true };

/**
 * Lays out Cards in rows of equal height. Columns follow the grid's own width, up to `columns`.
 * With `featured`, the card after each full row spans the next row on its own; give that Card
 * `orientation="horizontal"` so it uses the width.
 *
 * `columns={1}` features every card: each one is horizontal, with the image switching sides from
 * card to card. A Card's own `orientation` or `reversed` overrides this. The alternation counts
 * the grid's direct children, so pass the Cards (or an array of them) directly, not wrapped in a
 * fragment.
 */
export function CardGrid({ className, columns, featured, children, ...props }: CardGridProps) {
  const items =
    columns === 1
      ? Children.toArray(children).map((child, index) => (
          <CardGridItemContext
            key={isValidElement(child) ? child.key : index}
            value={index % 2 === 0 ? imageStart : imageEnd}
          >
            {child}
          </CardGridItemContext>
        ))
      : children;

  return (
    <div data-slot="card-grid" className={cn(cardGridVariants(), className)} {...props}>
      <div data-slot="card-grid-items" className={cardGridItemsVariants({ columns, featured })}>
        {items}
      </div>
    </div>
  );
}
