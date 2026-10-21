---
"@keyline/ui": minor
---

Add `CardGrid`, which lays out Cards in rows of equal height. `columns` (`1`, `2`, `3` or `4`, the default) sets the cards per row at full width; columns step down with the grid's own width through container queries, so it fits sidebars as well as pages. `featured` gives the card after each full row a row to itself (3 + 1 with three columns). `columns={1}` features every card: each is horizontal, with the image alternating sides. `--kl-card-grid-gap` sets the spacing.

`Card` takes `orientation="horizontal"`, which puts the CardImage beside the CardBody once the card is 42rem wide, with the body aligned to the edge away from the image, and stacks them below that. Add `reversed` to put the image on the right. A horizontal card sizes to its container, so give it a width.
