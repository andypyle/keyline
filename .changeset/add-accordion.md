---
"@keyline/ui": minor
---

Add `Accordion`, composed from `AccordionItem`, `AccordionTrigger` and `AccordionContent`. Each trigger is a button inside a heading (`headingLevel`, `3` by default), so screen reader users can move between sections by heading, and the arrow keys, Home and End move focus between triggers. Items open independently, or one at a time with `exclusive`. Give items a `value` to open them from `defaultValue`, or to control them with `value` and `onValueChange`; `disabled` locks an item. Opening and closing animate the content's height in every current browser, and not at all with reduced motion. Closed content is `hidden="until-found"`, so find-in-page can still find it and open its item where the browser supports that. `flat` removes the shadow.
