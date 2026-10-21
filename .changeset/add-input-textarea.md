---
"@keyline/ui": minor
---

Add `Input` and `Textarea`, single- and multi-line text fields. Both take a `size` (`sm`, `md`, `lg`) and a `radius`, show an error border when `aria-invalid` is set, and have quiet read-only and disabled states. Input's heights match Button's so the two line up in a row; it defaults to `type="text"`, and the native `size` attribute is passed as `htmlSize`. `Textarea` resizes vertically by default, or grows with its content when `autoResize` is set.
