import { useMemo } from "react";
import { cn } from "../../../lib/cn";
import { useCombobox } from "../../../lib/combobox-context";
import { useFieldControlProps } from "../../../lib/field-context";
import { getInitialOption, getOptionValues } from "../../../lib/listbox";
import { mergeRefs } from "../../../lib/merge-refs";
import { inputVariants } from "../../Input/Input.variants";
import type { ComboboxInputProps } from "./ComboboxInput.types";
import { comboboxIconVariants, comboboxInputVariants, comboboxToggleVariants } from "./ComboboxInput.variants";

/**
 * Text field that filters a Combobox's options and shows its value. It looks like an Input, with
 * the same `size`, `radius` and `aria-invalid` states, and ends in a chevron button that opens and
 * closes the full list. When the selected option has an icon, it shows at the start.
 */
export function ComboboxInput({
  ref,
  className,
  size,
  radius,
  disabled,
  toggleLabel = "Show options",
  onChange,
  onClick,
  onKeyDown,
  onBlur,
  ...props
}: ComboboxInputProps) {
  const combobox = useCombobox();
  const fieldProps = useFieldControlProps(props);
  const mergedRef = useMemo(() => mergeRefs(combobox.inputRef, ref), [combobox.inputRef, ref]);
  const isDisabled = combobox.disabled || disabled;
  const activeId =
    combobox.open && combobox.active ? combobox.items.get(combobox.active.value)?.id : undefined;
  const icon = combobox.selectedIcon;

  // Opens the full list, with the selected option (or the first) highlighted.
  function openAll(source: "keyboard" | "pointer") {
    const content = combobox.contentRef.current;
    const value = content && getInitialOption(content, combobox.value, "selected");
    combobox.setActive(value ? { value, source } : null);
    combobox.setOpen(true);
  }

  return (
    <>
      <input
        data-slot="combobox-input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={combobox.open}
        aria-controls={combobox.contentId}
        aria-activedescendant={activeId}
        autoComplete="off"
        disabled={isDisabled}
        value={combobox.inputValue}
        className={cn(inputVariants({ size, radius }), comboboxInputVariants({ size, withIcon: !!icon }), className)}
        onChange={(event) => {
          onChange?.(event);
          if (event.defaultPrevented) return;
          combobox.setInputValue(event.target.value);
          combobox.setQuery(event.target.value);
          combobox.setOpen(true);
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !combobox.open) openAll("pointer");
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          const content = combobox.contentRef.current;
          if (event.defaultPrevented || !content) return;

          if (!combobox.open) {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              openAll("keyboard");
            }
            // Escape on a closed list is left alone, so an enclosing Modal can close.
            return;
          }

          const values = getOptionValues(content);
          const index = combobox.active ? values.indexOf(combobox.active.value) : -1;
          const last = values.length - 1;

          switch (event.key) {
            case "ArrowDown":
              if (values.length) combobox.setActive({ value: values[Math.min(index + 1, last)]!, source: "keyboard" });
              break;
            case "ArrowUp":
              if (values.length) combobox.setActive({ value: values[Math.max(index - 1, 0)]!, source: "keyboard" });
              break;
            case "Enter":
              // Picks the highlighted option. Without one, settle the text as if leaving the input.
              // Either way it doesn't submit a surrounding form while the list is open.
              if (combobox.active) combobox.select(combobox.active.value);
              else combobox.commit();
              break;
            case "Escape":
              // Preventing the default keeps an enclosing Modal open; only the list closes.
              combobox.setOpen(false);
              break;
            default:
              // Home, End and the rest move the caret and edit the text, as in any text field.
              return;
          }
          event.preventDefault();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.defaultPrevented) combobox.commit();
        }}
        aria-required={combobox.required || undefined}
        {...props}
        {...fieldProps}
        id={fieldProps.id ?? combobox.inputId}
        ref={mergedRef}
      />
      {icon && (
        <span
          data-slot="icon"
          data-stale={combobox.inputValue !== combobox.selectedText || undefined}
          aria-hidden
          className={comboboxIconVariants({ size })}
        >
          {icon}
        </span>
      )}
      <button
        data-slot="combobox-toggle"
        type="button"
        tabIndex={-1}
        aria-label={toggleLabel}
        aria-expanded={combobox.open}
        aria-controls={combobox.contentId}
        disabled={isDisabled}
        className={comboboxToggleVariants({ size })}
        // Keep focus in the input, so typing carries on after the list opens.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          combobox.inputRef.current?.focus();
          if (combobox.open) combobox.setOpen(false);
          else openAll("pointer");
        }}
      >
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
            "kl:group-aria-expanded/combobox-toggle:rotate-180",
            "kl:motion-reduce:transition-none",
          ])}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </>
  );
}
