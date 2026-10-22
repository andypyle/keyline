---
"@keyline/ui": minor
---

Add `Slider`, which picks a number in a range by dragging a thumb or with the keyboard (arrow keys, Page Up/Down, Home and End). It takes `min`, `max`, `step` and `largeStep`, works controlled (`value` and `onValueChange`) or uncontrolled (`defaultValue`), and calls `onValueCommit` once a drag or key press finishes. `getValueText` sets the text assistive tech announces. `orientation="vertical"` stands it upright, and `size` is `sm`, `md` or `lg`. With `name` it submits with its form and resets with it, and in a Field its label names it. `children` render inside the track, behind the fill, for marks like a video's buffered progress. Its thumb uses the new `thumb` and `thumb-hover` color tokens, which stay light in dark mode.
