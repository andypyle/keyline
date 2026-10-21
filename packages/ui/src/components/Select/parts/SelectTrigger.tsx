import { useEffect, useMemo, useRef } from "react";
import { cn } from "../../../lib/cn";
import { useFieldControlProps } from "../../../lib/field-context";
import { getInitialOption, getOptionValues } from "../../../lib/listbox";
import { mergeRefs } from "../../../lib/merge-refs";
import { useSelect } from "../../../lib/select-context";
import type { SelectTriggerProps } from "./SelectTrigger.types";
import { selectTriggerVariants } from "./SelectTrigger.variants";

// Typed characters within this long of each other build up one search, so "ne" finds "Nectarine".
const TYPEAHEAD_RESET_MS = 500;
// How far PageUp and PageDown move.
const PAGE_SIZE = 10;

/**
 * Button that shows a Select's value, or the `placeholder` while nothing is picked, and opens its
 * options. Focus stays here while the list is open. Pass `aria-invalid` to show an error.
 */
export function SelectTrigger({
  ref,
  className,
  size,
  radius,
  placeholder,
  disabled,
  type = "button",
  onClick,
  onKeyDown,
  onPointerDown,
  ...props
}: SelectTriggerProps) {
  const select = useSelect();
  const fieldProps = useFieldControlProps(props);
  const mergedRef = useMemo(() => mergeRefs(select.triggerRef, ref), [select.triggerRef, ref]);
  const typeahead = useRef({ text: "", timer: 0 });
  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);
  // The pointer type of the press behind the next click, if a press on the trigger started it.
  const pressedWith = useRef<string | null>(null);

  const isDisabled = select.disabled || disabled;
  const selected = select.value !== null ? select.items.get(select.value) : undefined;
  const activeId = select.open && select.active ? select.items.get(select.active.value)?.id : undefined;

  function openOnto(which: "selected" | "first" | "last", source: "keyboard" | "pointer") {
    const content = select.contentRef.current;
    const value = content && getInitialOption(content, select.value, which);
    select.setActive(value ? { value, source } : null);
    select.setOpen(true);
  }

  function toggle() {
    // Safari doesn't focus buttons on click, and the trigger must hold focus for the keyboard to work.
    select.triggerRef.current?.focus();
    if (select.open) select.setOpen(false);
    else openOnto("selected", "pointer");
  }

  // Finds the next option whose text starts with what's been typed. Repeating one letter cycles
  // through the options starting with it, like a native select.
  function search(key: string) {
    const content = select.contentRef.current;
    if (!content) return;
    const state = typeahead.current;
    state.text += key.toLowerCase();
    window.clearTimeout(state.timer);
    state.timer = window.setTimeout(() => (state.text = ""), TYPEAHEAD_RESET_MS);

    const repeated = [...state.text].every((char) => char === state.text[0]);
    const query = repeated ? state.text[0]! : state.text;
    const values = getOptionValues(content);
    const from = select.active?.value ?? select.value;
    const start = from !== null ? values.indexOf(from) : -1;
    // A new search can match the current option; a repeated letter moves past it.
    const offset = repeated ? 1 : 0;
    const ordered = [...values.slice(start + offset), ...values.slice(0, start + offset)];
    const match = ordered.find((value) => select.items.get(value)?.text.toLowerCase().startsWith(query));
    if (!match) return;
    select.setActive({ value: match, source: "keyboard" });
    select.setOpen(true);
  }

  return (
    <button
      data-slot="select-trigger"
      type={type}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={select.open}
      aria-controls={select.contentId}
      aria-activedescendant={activeId}
      disabled={isDisabled}
      className={cn(selectTriggerVariants({ size, radius }), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pressedWith.current = event.pointerType;
        // A mouse opens the list on press, like a native select. Chrome fires pointer events on
        // disabled buttons, so that's checked here too. Ctrl+click is the context menu on macOS.
        if (event.defaultPrevented || isDisabled || event.pointerType !== "mouse") return;
        if (event.button !== 0 || event.ctrlKey) return;
        toggle();
      }}
      onClick={(event) => {
        onClick?.(event);
        const pointer = pressedWith.current;
        pressedWith.current = null;
        if (event.defaultPrevented) return;
        // Touch and pen open on a completed tap, so a scroll that starts on the trigger doesn't
        // open it. Clicks with no press on the trigger behind them come from a <label for>, or from
        // Enter and Space, which keydown already handled; they only focus, like a native select.
        if (pointer && pointer !== "mouse") toggle();
        else event.currentTarget.focus();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const content = select.contentRef.current;
        if (event.defaultPrevented || !content) return;
        const { key } = event;

        // Space continues a search in progress ("New York"); otherwise it opens or picks.
        const printable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
        if (printable && (key !== " " || typeahead.current.text)) {
          event.preventDefault();
          search(key);
          return;
        }
        // Any other key ends a search, so a following Space picks instead of extending it.
        typeahead.current.text = "";

        if (!select.open) {
          if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") openOnto("selected", "keyboard");
          else if (key === "Home") openOnto("first", "keyboard");
          else if (key === "End") openOnto("last", "keyboard");
          else return;
          event.preventDefault();
          return;
        }

        const values = getOptionValues(content);
        const index = select.active ? values.indexOf(select.active.value) : -1;
        const last = values.length - 1;
        let next: string | undefined;

        switch (key) {
          case "ArrowDown":
            next = values[Math.min(index + 1, last)];
            break;
          case "ArrowUp":
            // Alt+ArrowUp picks the highlighted option and closes, as in the APG pattern.
            if (event.altKey && select.active) {
              select.select(select.active.value);
              break;
            }
            next = values[Math.max(index - 1, 0)];
            break;
          case "Home":
            next = values[0];
            break;
          case "End":
            next = values[last];
            break;
          case "PageDown":
            next = values[Math.min(index + PAGE_SIZE, last)];
            break;
          case "PageUp":
            next = values[Math.max(index - PAGE_SIZE, 0)];
            break;
          case "Enter":
          case " ":
            if (select.active) select.select(select.active.value);
            else select.setOpen(false);
            break;
          case "Escape":
            // Preventing the default keeps an enclosing Modal open; only the list closes.
            select.setOpen(false);
            break;
          case "Tab":
            // Focus moves on as usual; the list closes without changing the value.
            select.setOpen(false);
            return;
          default:
            return;
        }

        event.preventDefault();
        if (next !== undefined) select.setActive({ value: next, source: "keyboard" });
      }}
      aria-required={select.required || undefined}
      {...props}
      {...fieldProps}
      id={fieldProps.id ?? select.triggerId}
      ref={mergedRef}
    >
      {selected?.icon && (
        <span data-slot="icon" aria-hidden className={cn(["kl:inline-flex", "kl:shrink-0"])}>
          {selected.icon}
        </span>
      )}
      <span
        data-slot="select-value"
        data-placeholder={selected ? undefined : ""}
        className={cn(["kl:flex-1", "kl:min-w-0", "kl:py-0.5", "kl:truncate", "kl:data-placeholder:text-fg-3"])}
      >
        {selected?.text ?? placeholder}
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={cn([
          "kl:transition-transform",
          "kl:duration-320",
          "kl:ease-bounce",
          "kl:group-aria-expanded/select-trigger:rotate-180",
          "kl:motion-reduce:transition-none",
        ])}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
