---
"@keyline/ui": minor
---

Add `Table`, composed from `TableCaption`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead` and `TableCell`, which render the native table elements. The table sits in an outlined, rounded container with a hard shadow; `flat` drops the shadow, like on `Card`, and `noRowBorders` drops the rules between body rows, keeping the header's and footer's. A table wider than its container scrolls sideways, and the container becomes a tab stop while it does so keyboard users can scroll it. `stickyColumn` keeps the first cell of each row in view while it scrolls sideways, and with `maxHeight` capping its height, `stickyHeader` keeps the header rows in view while it scrolls down. The caption stays in the visible part of a table scrolled sideways. `TableHead` defaults `scope` to `col` in a `TableHeader` and `row` elsewhere, and `TableHead` and `TableCell` take `align` (`start`, `center` or `end`) for lining up numeric columns.
