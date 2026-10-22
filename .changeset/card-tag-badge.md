---
"@keyline/ui": minor
---

`CardTag` now renders a `Badge` inside its `li`, so it takes Badge's `variant`, `tone`, `size`, `startIcon` and `endIcon`. It defaults to a neutral outline, which looks the same as before in light mode. In dark mode the outline now follows the text color, so tag borders are light instead of near-black. `className`, `ref` and other attributes still go to the `li`.
