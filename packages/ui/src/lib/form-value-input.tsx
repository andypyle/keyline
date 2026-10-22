import { cn } from "./cn";

interface FormValueInputProps {
  name?: string;
  form?: string;
  required: boolean;
  disabled: boolean;
  value: string | null;
  /** The control to move focus to when the browser focuses this input, as it does when validation fails. */
  onFocus: () => void;
}

/**
 * Carries a custom control's value into form submission and validation, for Select, Combobox, DatePicker and DateRangePicker.
 * It isn't type="hidden" or read-only, since browsers skip those when validating `required`, so
 * it's made invisible and unreachable instead. It sits at the parent's bottom-left corner, which
 * must be positioned, so the browser's validation bubble points at the control.
 */
export function FormValueInput({ name, form, required, disabled, value, onFocus }: FormValueInputProps) {
  if (name === undefined && !required) return null;
  return (
    <input
      aria-hidden
      tabIndex={-1}
      name={name}
      form={form}
      required={required}
      disabled={disabled}
      value={value ?? ""}
      onChange={() => {}}
      onFocus={onFocus}
      className={cn([
        "kl:absolute",
        "kl:bottom-0",
        "kl:left-4",
        "kl:size-px",
        "kl:m-0",
        "kl:p-0",
        "kl:border-0",
        "kl:opacity-0",
        "kl:pointer-events-none",
      ])}
    />
  );
}
