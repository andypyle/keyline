---
"@keyline/ui": minor
---

Add `Checkbox`, `Radio` and `RadioGroup`. Both controls are native inputs with their look cleared, so labels, forms, `required`, Space and the radios' arrow keys work as usual; props and `className` go to the input. They take a `size` (`sm`, `md`, `lg`), fill with the accent when checked, with a check or dot that pops in, and show `aria-invalid` and disabled states. `Checkbox` takes `indeterminate`, which shows a dash and is announced as "mixed". `RadioGroup` ties its Radios together under one name, with `value`, `defaultValue` and `onValueChange`, `name`, `required`, `disabled`, a `size` for every Radio, and `orientation` (`vertical` or `horizontal`).
