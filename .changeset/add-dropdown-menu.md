---
"@keyline/ui": minor
---

Add `DropdownMenu`, composed from `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` and `DropdownMenuSeparator`. The trigger is a `Button`, so it takes every Button `variant`, `size` and `radius`, and ends in a chevron that turns to point up while the menu is open. The menu follows the WAI-ARIA menu button pattern (arrow keys, Home, End, typeahead, Escape, Tab and click-outside to close, focus returned to the trigger), opens in the top layer tethered to the trigger with CSS anchor positioning, flips above it when there's no room below, and lines up with either edge via `align`. Items take a `danger` variant and a `disabled` state that stays focusable, and calling `preventDefault()` in an item's `onClick` keeps the menu open. `open`, `defaultOpen` and `onOpenChange` support controlled and uncontrolled use.
