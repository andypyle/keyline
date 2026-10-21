import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { cn } from "../../../lib/cn";
import { useCombobox } from "../../../lib/combobox-context";
import { getControlLabel, getInitialOption, getOptionValues } from "../../../lib/listbox";
import { mergeRefs } from "../../../lib/merge-refs";
import type { ComboboxContentProps } from "./ComboboxContent.types";
import { comboboxContentVariants } from "./ComboboxContent.variants";

/**
 * Popover holding a Combobox's options. It stays in the DOM while closed, so the input's
 * `aria-controls` always points somewhere and the input can show the selected option's text. The
 * options sit in a listbox named by the input's label; `empty` shows in a status region beside it,
 * since a listbox may only hold options.
 */
export function ComboboxContent({
  ref,
  className,
  align,
  empty = "No matches",
  loading = false,
  loadingText = "Loading…",
  children,
  onMouseDown,
  ...props
}: ComboboxContentProps) {
  const combobox = useCombobox();
  const mergedRef = useMemo(() => mergeRefs(combobox.contentRef, ref), [combobox.contentRef, ref]);
  const { open, active, value, query, items, allowCustomValue, setActive, contentRef, inputRef } = combobox;
  const [label, setLabel] = useState<string>();

  // Show or hide the popover to match the Combobox's state. A list opened from outside (a
  // controlled `open`) has nothing highlighted yet, so start it on the selected option.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (inputRef.current) setLabel(getControlLabel(inputRef.current));
    const showing = content.matches(":popover-open");
    if (open && !showing) {
      content.showPopover();
      content.querySelector("[data-highlighted]")?.scrollIntoView({ block: "nearest" });
      if (!active) {
        const initial = getInitialOption(content, value, "selected");
        if (initial) setActive({ value: initial, source: "pointer" });
      }
    } else if (!open && showing) {
      content.hidePopover();
    }
  }, [open, active, value, setActive, contentRef, inputRef]);

  // Typing highlights the first match, so Enter picks it. With allowCustomValue it highlights
  // nothing, so Enter keeps the typed text. These run before paint, once filtered-out options are
  // hidden, so the highlight never lands on one of them.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!open || !content || query === "") return;
    const first = allowCustomValue ? undefined : getOptionValues(content)[0];
    setActive(first ? { value: first, source: "keyboard" } : null);
  }, [query, open, allowCustomValue, setActive, contentRef]);

  // Options loaded for a query arrive after it, and can replace the highlighted one. Move the
  // highlight onto the first result then, leaving it alone while it's still there.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!open || !content) return;
    const values = getOptionValues(content);
    if (active && values.includes(active.value)) return;
    if (!active && (query === "" || allowCustomValue)) return;
    const first = allowCustomValue ? undefined : values[0];
    setActive(first ? { value: first, source: "keyboard" } : null);
  }, [items, open, active, query, allowCustomValue, setActive, contentRef]);

  // Keep the highlighted option in view as the keyboard moves through a long list (opening scrolls
  // to it above). Options the pointer highlights are already under it, so they're left alone.
  const activeId = open && active ? combobox.items.get(active.value)?.id : undefined;
  const fromKeyboard = active?.source === "keyboard";
  useEffect(() => {
    if (activeId && fromKeyboard) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId, fromKeyboard]);

  return (
    <div
      data-slot="combobox-content"
      popover="manual"
      className={cn(comboboxContentVariants({ align }), className)}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // Keep focus in the input, which owns the keyboard while the list is open.
        event.preventDefault();
      }}
      {...props}
      ref={mergedRef}
    >
      <div
        id={combobox.contentId}
        role="listbox"
        aria-label={label}
        aria-busy={loading || undefined}
        className={cn(["kl:flex", "kl:overflow-y-auto", "kl:flex-col", "kl:gap-0.5", "kl:min-h-0"])}
      >
        {children}
      </div>
      <div
        role="status"
        className={cn(["kl:px-3", "kl:py-2.5", "kl:text-sm", "kl:text-fg-3", "kl:empty:p-0"])}
      >
        {!open ? null : loading ? loadingText : !combobox.hasMatches ? empty : null}
      </div>
    </div>
  );
}
