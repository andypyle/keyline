---
"@keyline/ui": minor
---

`react` and `react-dom` peer dependencies now require version 19 or later, up from 18. Components take `ref` as a regular prop, which only React 19 supports: on React 18, refs never reached the element.
