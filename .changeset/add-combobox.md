---
"@keyline/ui": minor
---

Add `Combobox`, a text field that filters a list of options as you type, composed from `ComboboxInput`, `ComboboxContent` and `ComboboxItem`, with `ComboboxGroup`, `ComboboxLabel` and `ComboboxSeparator` to organise long lists. It follows the WAI-ARIA editable combobox pattern with list autocomplete: focus stays in the input while the highlighted option is announced through `aria-activedescendant`.

- Typing opens and filters the list, matching anywhere in an option's text and ignoring case and accents (or by a custom `filter`), and highlights the first match so Enter picks it. Groups with no matches hide, label and all, and separators hide while filtering.
- ArrowDown, ArrowUp, a click or the chevron toggle opens the full list. Escape closes it and puts back the selected option's text; inside a `Modal` it closes only the list.
- Leaving the field picks an option its text names exactly, and clears the value (`onValueChange(null)`) if the text is empty. Other text is undone, or with `allowCustomValue` becomes the value; typing then highlights nothing, so Enter keeps what was typed.
- To load options as the user types, pass `filter={false}`, fetch in `onQueryChange`, and set `loading` on `ComboboxContent`. The selected option's text and icon are remembered after it leaves the results.
- `ComboboxContent` announces `empty` ("No matches") or `loadingText` ("Loading…") in a status region.
- `ComboboxInput` looks like an `Input`, with the same `size`, `radius`, `aria-invalid` and disabled states. `ComboboxItem` takes `icon`, `disabled` and `textValue` like `SelectItem`; the selected option's icon shows at the input's start, dimming while the text is edited.
- `name` and `required` work with forms as on `Select`, submitting the value rather than the text.
