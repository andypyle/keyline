---
"@keyline/ui": minor
---

Add `MediaImage` and `MediaVideo`, an image and a video in Keyline's outline and offset shadow. Both take `ratio` (`auto`, `1/1`, `4/3`, `3/2`, `16/9`, `21/9`, `3/4`, `9/16`), `fit` (`cover` or `contain`), `radius`, `flat` and `noBorders`. `MediaImage` requires `alt`; `MediaVideo` shows the browser's controls and plays inline by default. The frame styles the media element itself, so `mediaImageVariants()` and `mediaVideoVariants()` give framework image components such as `next/image` or Astro's `<Image>` the same frame through `className`.
