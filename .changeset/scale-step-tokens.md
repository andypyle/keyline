---
"@keyline/ui": minor
---

Semantic color tokens now always point at a step on a color scale, in both themes. Dark mode no longer redefines scale steps: `--kl-color-sage-100` and the other `-100` tints keep their light value under `data-theme="dark"`, and the dark soft tints moved to new `-900` steps (`sage-900`, `mist-900`, `moss-900`, `dusk-900`, `amber-900`, `rust-900`). Also adds `slate-800` and `ink-950`. If you read a `-100` scale token directly to get a tint that darkens in dark mode, switch to the semantic token (`accent-soft`, `danger-soft`, …).

Adds `on-danger` and `on-info` for text on danger and info fills, which Button, Badge, Toast and DropdownMenuItem now use instead of `white`. `overlay` is now built from scale steps with `color-mix()`. Some dark-mode neutrals moved to the nearest scale step, so `surface`, `fg-1`, `fg-2`, `fg-3`, `inverse`, `subtle`, `line` and `code` shift slightly in dark mode.
