---
"@keyline/ui": minor
---

`data-theme="dark"` now works on any element, not just `<html>`, so one section of a light page (a sidebar, a hero, a preview panel) can be dark. Previously, tokens that point at other tokens, such as `surface-hover`, the `*-soft` tints and the `shadow-*` scale, kept their light values below `<html>`; the dark theme now restates them so they resolve against the dark palette wherever it's set.
