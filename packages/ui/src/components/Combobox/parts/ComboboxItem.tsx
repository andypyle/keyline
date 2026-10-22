import { useId, useLayoutEffect } from "react";
import { cn } from "@/lib/cn";
import { useCombobox } from "@/lib/combobox-context";
import { getText } from "@/lib/listbox";
import { selectItemVariants } from "@/components/Select/parts/SelectItem.variants";
import type { ComboboxItemProps } from "./ComboboxItem.types";

/**
 * One option in a Combobox, styled like a SelectItem. It hides while it doesn't match the typed
 * text, staying mounted so the input can still show it once it's selected. The selected option
 * shows a check.
 */
export function ComboboxItem({
  className,
  value,
  icon,
  disabled = false,
  textValue,
  children,
  onClick,
  onPointerMove,
  ...props
}: ComboboxItemProps) {
  const combobox = useCombobox();
  const id = useId();
  const text = textValue ?? getText(children);
  const { registerItem } = combobox;

  // Registered before paint, so the input shows the selected option's text on the first frame.
  useLayoutEffect(
    () => registerItem(value, { id, text, icon, disabled }),
    [registerItem, value, id, text, icon, disabled],
  );

  const hidden = !combobox.matches(text);
  const selected = combobox.value === value;
  const highlighted = combobox.open && combobox.active?.value === value ? combobox.active.source : undefined;

  return (
    <div
      data-slot="combobox-item"
      data-value={value}
      data-highlighted={highlighted}
      id={id}
      role="option"
      hidden={hidden}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      // selectItemVariants sets display: flex, which would override the hidden attribute.
      className={cn(selectItemVariants(), hidden && ["kl:hidden"], className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        combobox.select(value);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || disabled || event.pointerType === "touch") return;
        if (highlighted !== "pointer") combobox.setActive({ value, source: "pointer" });
      }}
      {...props}
    >
      {icon && (
        <span data-slot="icon" aria-hidden className={cn(["kl:inline-flex", "kl:shrink-0"])}>
          {icon}
        </span>
      )}
      <span className={cn(["kl:flex-1", "kl:min-w-0", "kl:py-0.5", "kl:truncate"])}>{children}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={cn(["kl:invisible", "kl:group-aria-selected/select-item:visible"])}
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>
  );
}
