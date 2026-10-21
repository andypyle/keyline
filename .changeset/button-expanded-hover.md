---
"@keyline/ui": patch
---

A `Button` with `aria-expanded="true"` now holds its hover look (lift, shadow and fill), so a button whose menu or popover is open doesn't drop back when the pointer moves into the popup. Pressing it still drops it onto its shadow. Buttons inside a `ButtonGroup` stay flat as before.
