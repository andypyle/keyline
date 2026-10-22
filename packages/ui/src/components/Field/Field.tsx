import { useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { FieldContext } from "../../lib/field-context";
import type { FieldProps } from "./Field.types";
import { fieldVariants } from "./Field.variants";

/**
 * Ties a form control to its label, description and error message. Compose it from a FieldLabel,
 * one control (Input, Textarea, Select, Combobox, DatePicker, DateRangePicker, Checkbox, Switch, RadioGroup or Slider), and
 * optionally a FieldDescription and a FieldError. The Field gives the control an id for the label
 * to point at, describes it by the description and error, and passes down `invalid`, `disabled` and
 * `required`.
 *
 * With `orientation="horizontal"`, put the control first: it sits beside the label, with the
 * description and error under the label.
 */
export function Field({ className, orientation, invalid = false, disabled = false, required = false, ...props }: FieldProps) {
  const id = useId();
  const [customControlId, setControlId] = useState<string>();
  const [hasLabel, setHasLabel] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);

  const context = useMemo(
    () => ({
      controlId: customControlId ?? `${id}-control`,
      setControlId,
      labelId: `${id}-label`,
      hasLabel,
      setHasLabel,
      descriptionId: `${id}-description`,
      hasDescription,
      setHasDescription,
      errorId: `${id}-error`,
      hasError,
      setHasError,
      invalid,
      disabled,
      required,
    }),
    [id, customControlId, hasLabel, hasDescription, hasError, invalid, disabled, required],
  );

  return (
    <FieldContext value={context}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext>
  );
}
