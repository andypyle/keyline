---
"@keyline/ui": minor
---

Add `VideoModal`, which opens a `VideoPlayer` in a modal. Compose it from `VideoModalTrigger`, a 16:9 poster with a play badge (or, with `asChild`, any element you pass, like a `Button`), and `VideoModalContent` holding a `VideoModalTitle`, a `VideoPlayerVideo` and `VideoPlayerControls`. Opening starts the video from the beginning and moves focus to it, so the player's keyboard shortcuts work straight away; `autoPlay={false}` waits for the viewer to press play. Closing pauses it. The title sits in a chip over the top of the video, fading while the pointer is over the video, and names the dialog either way. It's a `Modal`, so `open`, `defaultOpen` and `onOpenChange` work as usual.
