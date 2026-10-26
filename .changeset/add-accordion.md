---
"@keyline/ui": minor
---

Add `Accordion`, composed from `AccordionItem`, `AccordionTrigger` and `AccordionContent`. Each item is a native `<details>` with a `<summary>` trigger, so the browser handles the keyboard, announces the expanded state, and opens an item when find-in-page matches text inside it. `exclusive` keeps at most one item open, using the native `<details name>`. Items open and close with a height transition where the browser supports `::details-content` and `interpolate-size`, and instantly elsewhere. `flat` removes the shadow.
