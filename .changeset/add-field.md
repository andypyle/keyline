---
"@keyline/ui": minor
---

Add `Field`, which ties a form control to a `FieldLabel`, `FieldDescription` and `FieldError`.

- It gives the control an id for the label (or follows the control's own `id`), describes the control by the description and, while `invalid`, the error, and passes `invalid`, `disabled` and `required` down. A required Field marks its label with an asterisk. `orientation="horizontal"` puts the control beside the label, for `Checkbox` and `Switch`.
- `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch` and `RadioGroup` read an enclosing Field; their own props win. A `RadioGroup` is named by the `FieldLabel` through `aria-labelledby`. `SelectTrigger` and `ComboboxInput` now set `aria-required` when their Select or Combobox is required.
- New `danger-text` color token for error messages, which lightens in dark mode where `danger` is too dim to read.
