---
"@keyline/ui": minor
---

Add `Toaster` and `useToast()` for brief, non-blocking notifications. Wrap your app in a `Toaster`; anything inside it can call `toast({ title, description, tone, action, duration })` (or `toast("Saved")`), which returns an id, and `dismiss(id)`, or `dismiss()` to close every toast. Toasts stack in the corner or edge set by `position` (`bottom-end` by default), in a region named "Notifications" that renders in the top layer, so they show above a Modal. Each toast closes itself after `duration` (5 seconds by default; `Infinity` keeps it), pausing while it's hovered, focused or the page is hidden. Escape closes the focused toast, F8 moves focus to the toasts, and focus returns to where it was when the focused toast closes. Past `limit` (3 by default), showing a toast closes the oldest one.

Toasts are also available to compose yourself: `Toast` with `ToastTitle`, `ToastDescription` and `ToastAction`. A `Toast` is a `role="status"` live region with a `tone` (`neutral`, `success`, `warning`, `danger`, `info`) that sets its icon and, for the status tones, tints the panel with the tone's soft color, a close button (`closeLabel`, `noCloseButton`), and `open`, `defaultOpen` and `onOpenChange` for controlled and uncontrolled use. `ToastAction` is a small `secondary` Button that closes the toast after its `onClick`.
