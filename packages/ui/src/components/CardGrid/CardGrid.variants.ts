import { cva, type VariantProps } from "class-variance-authority";

// CardGrid is the `card-grid` container, and the grid is an element inside it, because a container
// query can't restyle the element that declares the container. --kl-card-grid-gap sets the spacing
// between cards, in both directions.
export const cardGridVariants = cva([
  "kl:[--kl-card-grid-gap:--spacing(6)]",
  "kl:@container/card-grid",
]);

// Columns step up with the grid's own width, so a grid in a sidebar stays narrow: one column, then
// two from 32rem, then the full count from 48rem (3) or 64rem (4). Grid rows stretch the cards in
// each row to the same height, so their CardActions line up.
//
// `featured` gives the card after each full row the whole next row (3 + 1, 3 + 1, … with three
// columns). It skips any column count that wouldn't divide a run evenly, so a run never leaves a
// gap before its featured card.
export const cardGridItemsVariants = cva(["kl:grid", "kl:grid-cols-1", "kl:gap-(--kl-card-grid-gap)"], {
  variants: {
    /** Cards per row at full width. `1` also makes every card horizontal, alternating sides. */
    columns: {
      1: [],
      2: ["kl:@lg/card-grid:grid-cols-2"],
      3: ["kl:@3xl/card-grid:grid-cols-3"],
      4: ["kl:@lg/card-grid:grid-cols-2", "kl:@5xl/card-grid:grid-cols-4"],
    },
    /** Gives the card after each full row a row of its own. Pair it with a horizontal Card. */
    featured: {
      true: [],
      false: [],
    },
  },
  compoundVariants: [
    // Two columns would leave a three-card run as 2 + 1 with a hole, so only plain grids take that step.
    { columns: 3, featured: false, class: ["kl:@lg/card-grid:grid-cols-2"] },
    { columns: 2, featured: true, class: ["kl:[&>:nth-child(3n)]:col-span-full"] },
    { columns: 3, featured: true, class: ["kl:[&>:nth-child(4n)]:col-span-full"] },
    { columns: 4, featured: true, class: ["kl:[&>:nth-child(5n)]:col-span-full"] },
  ],
  defaultVariants: {
    columns: 4,
    featured: false,
  },
});

export type CardGridVariantProps = VariantProps<typeof cardGridItemsVariants>;
