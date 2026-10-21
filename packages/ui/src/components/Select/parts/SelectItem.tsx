import { useId, useLayoutEffect } from "react";
import { cn } from "../../../lib/cn";
import { getText, useSelect } from "../../../lib/select-context";
import type { SelectItemProps } from "./SelectItem.types";
import { selectItemVariants } from "./SelectItem.variants";

/** One option in a Select. The selected option shows a check. */
export function SelectItem({
  className,
  value,
  disabled = false,
  textValue,
  icon,
  children,
  onClick,
  onPointerMove,
  ...props
}: SelectItemProps) {
  const select = useSelect();
  const id = useId();
  const text = textValue ?? getText(children);
  const { registerItem } = select;

  // Registered before paint, so the trigger shows the selected option's text and icon on the first frame.
  useLayoutEffect(
    () => registerItem(value, { id, text, icon, disabled }),
    [registerItem, value, id, text, icon, disabled],
  );

  const selected = select.value === value;
  const highlighted = select.open && select.active?.value === value ? select.active.source : undefined;

  return (
    <div
      data-slot="select-item"
      data-value={value}
      data-highlighted={highlighted}
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cn(selectItemVariants(), className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        select.select(value);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || disabled || event.pointerType === "touch") return;
        if (highlighted !== "pointer") select.setActive({ value, source: "pointer" });
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
