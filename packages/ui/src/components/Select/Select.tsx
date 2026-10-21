import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { FormValueInput } from "../../lib/form-value-input";
import { useItemRegistry, type ListboxActive } from "../../lib/listbox";
import { SelectContext } from "../../lib/select-context";
import type { SelectProps } from "./Select.types";

/**
 * Picks one value from a list of options. Compose it from a SelectTrigger and a SelectContent
 * holding SelectItems. Label it by giving the SelectTrigger an `id` and pointing a `<label for>` at
 * it, or with `aria-labelledby` or `aria-label` on the trigger.
 *
 * It follows the WAI-ARIA select-only combobox pattern. Focus stays on the trigger and the
 * highlighted option is announced through `aria-activedescendant`. The trigger opens the list with
 * a click, ArrowDown, ArrowUp, Enter or Space (Home and End open onto the first and last option);
 * arrow keys, Home, End, PageUp, PageDown and typeahead move through the options; Enter, Space or a
 * click picks one; Escape, Tab and clicks outside close the list without changing the value.
 */
export function Select({
  className,
  style,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  form,
  required = false,
  disabled = false,
  children,
  ...props
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
  const valueControlled = valueProp !== undefined;
  const value = valueControlled ? valueProp : uncontrolledValue;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const openControlled = openProp !== undefined;
  const open = openControlled ? openProp : uncontrolledOpen;

  const [active, setActive] = useState<ListboxActive | null>(null);
  const [items, registerItem] = useItemRegistry();

  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!next) setActive(null);
      if (!openControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, openControlled, onOpenChange],
  );

  const select = useCallback(
    (next: string) => {
      if (next !== value) {
        if (!valueControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      }
      setOpen(false);
    },
    [value, valueControlled, onValueChange, setOpen],
  );

  // The list is a manual popover, so the browser doesn't light-dismiss it; close it on a press
  // outside here. Presses on the trigger are left to its own click handler, which toggles.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  const context = useMemo(
    () => ({
      value,
      select,
      open,
      setOpen,
      active,
      setActive,
      disabled,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      contentRef,
      items,
      registerItem,
    }),
    [value, select, open, setOpen, active, disabled, id, items, registerItem],
  );

  // The content renders in the top layer, so it's tethered to this wrapper with CSS anchor
  // positioning. Anchor names are global dashed idents, so each Select gets its own.
  const anchor = `--kl-select-${id.replace(/[^\w-]/g, "")}`;

  return (
    <SelectContext value={context}>
      <div
        data-slot="select"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(["kl:relative", "kl:[anchor-name:var(--kl-select-anchor)]", "kl:w-full"], className)}
        style={{ "--kl-select-anchor": anchor, ...style } as CSSProperties}
        {...props}
      >
        {children}
        <FormValueInput
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          value={value}
          onFocus={() => triggerRef.current?.focus()}
        />
      </div>
    </SelectContext>
  );
}
