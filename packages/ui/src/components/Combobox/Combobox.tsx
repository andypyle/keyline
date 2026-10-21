import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { ComboboxContext, defaultComboboxFilter, namesOption } from "../../lib/combobox-context";
import { FormValueInput } from "../../lib/form-value-input";
import { useItemRegistry, type ListboxActive, type ListboxItemRecord } from "../../lib/listbox";
import type { ComboboxProps } from "./Combobox.types";

/**
 * A text field that filters a list of options as you type. Compose it from a ComboboxInput and a
 * ComboboxContent holding ComboboxItems, optionally in ComboboxGroups with ComboboxSeparators.
 * Label it by giving the ComboboxInput an `id` and pointing a `<label for>` at it, or with
 * `aria-labelledby` or `aria-label` on the input.
 *
 * It follows the WAI-ARIA editable combobox pattern with list autocomplete. Focus stays in the
 * input while the highlighted option is announced through `aria-activedescendant`. Typing opens
 * the list, filters it and highlights the first match; ArrowDown, ArrowUp, a click or the toggle
 * opens the full list; Enter or a click picks an option; Escape closes the list and puts back the
 * selected option's text. When the input loses focus, text that names an option exactly picks
 * it and empty text clears the value. Anything else is undone, unless `allowCustomValue` is set,
 * in which case it becomes the value.
 */
export function Combobox({
  className,
  style,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  filter = defaultComboboxFilter,
  onQueryChange,
  allowCustomValue = false,
  name,
  form,
  required = false,
  disabled = false,
  children,
  ...props
}: ComboboxProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
  const valueControlled = valueProp !== undefined;
  const value = valueControlled ? valueProp : uncontrolledValue;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const openControlled = openProp !== undefined;
  const open = openControlled ? openProp : uncontrolledOpen;

  const [active, setActive] = useState<ListboxActive | null>(null);
  const [items, registerItem] = useItemRegistry();
  const [inputValue, setInputValue] = useState("");
  const [query, setQueryState] = useState("");

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Options loaded as the user types come and go, so remember the selected one's text and icon
  // for when it's no longer rendered.
  const record = value !== null ? items.get(value) : undefined;
  const [remembered, setRemembered] = useState<{ value: string; record: ListboxItemRecord } | null>(null);
  useLayoutEffect(() => {
    if (value !== null && record) setRemembered({ value, record });
  }, [value, record]);
  const known = record ?? (remembered && remembered.value === value ? remembered.record : undefined);
  const selectedText = known?.text ?? (allowCustomValue && value !== null ? value : "");
  const selectedIcon = known?.icon;

  // While the list is closed, the input shows the selected option's text. That covers picking,
  // Escape, a controlled value changing, and the selected option registering after the first render.
  useLayoutEffect(() => {
    if (!open) setInputValue(selectedText);
  }, [open, selectedText]);

  // Tracked in a ref too, so a repeated value (closing an already-reset list) doesn't call
  // onQueryChange again, without a side effect inside a state updater.
  const queryRef = useRef("");
  const setQuery = useCallback(
    (next: string) => {
      if (next === queryRef.current) return;
      queryRef.current = next;
      setQueryState(next);
      onQueryChange?.(next);
    },
    [onQueryChange],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!next) {
        setActive(null);
        setQuery("");
      }
      if (!openControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, openControlled, onOpenChange, setQuery],
  );

  const select = useCallback(
    (next: string | null) => {
      if (next !== value) {
        if (!valueControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      }
      setOpen(false);
    },
    [value, valueControlled, onValueChange, setOpen],
  );

  const commit = useCallback(() => {
    const typed = inputValue.trim();
    if (typed === "") {
      select(null);
      return;
    }
    if (typed === selectedText) {
      setOpen(false);
      return;
    }
    const named = [...items].find(([, item]) => !item.disabled && namesOption(item.text, typed));
    if (named) {
      select(named[0]);
    } else if (allowCustomValue) {
      select(typed);
    } else {
      setOpen(false);
      // Already closed (a controlled list), so the effect above won't run; put the text back here.
      setInputValue(selectedText);
    }
  }, [inputValue, items, select, setOpen, selectedText, allowCustomValue]);

  const matches = useCallback(
    (text: string) => filter === false || query === "" || filter(text, query),
    [query, filter],
  );
  const hasMatches = useMemo(() => [...items.values()].some((item) => matches(item.text)), [items, matches]);

  const context = useMemo(
    () => ({
      value,
      select,
      commit,
      selectedText,
      selectedIcon,
      allowCustomValue,
      open,
      setOpen,
      active,
      setActive,
      inputValue,
      setInputValue,
      query,
      setQuery,
      matches,
      hasMatches,
      disabled,
      inputId: `${id}-input`,
      contentId: `${id}-content`,
      inputRef,
      contentRef,
      items,
      registerItem,
    }),
    [
      value,
      select,
      commit,
      selectedText,
      selectedIcon,
      allowCustomValue,
      open,
      setOpen,
      active,
      inputValue,
      query,
      setQuery,
      matches,
      hasMatches,
      disabled,
      id,
      items,
      registerItem,
    ],
  );

  // The content renders in the top layer, so it's tethered to this wrapper with CSS anchor
  // positioning. Anchor names are global dashed idents, so each Combobox gets its own. The wrapper
  // is also what the input's icon and toggle button are positioned against.
  const anchor = `--kl-combobox-${id.replace(/[^\w-]/g, "")}`;

  return (
    <ComboboxContext value={context}>
      <div
        data-slot="combobox"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(["kl:relative", "kl:[anchor-name:var(--kl-combobox-anchor)]", "kl:w-full"], className)}
        style={{ "--kl-combobox-anchor": anchor, ...style } as CSSProperties}
        {...props}
      >
        {children}
        <FormValueInput
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          value={value}
          onFocus={() => inputRef.current?.focus()}
        />
      </div>
    </ComboboxContext>
  );
}
