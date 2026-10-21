import { createContext, useContext, useLayoutEffect } from "react";

/** What a Field shares with its label, description, error and control. */
export interface FieldContextValue {
  /** The control's id, which the label points at. A control given its own `id` reports it here. */
  controlId: string;
  setControlId: (id: string | undefined) => void;
  labelId: string;
  /** Set while a FieldLabel is rendered, so a RadioGroup only points at a label that exists. */
  hasLabel: boolean;
  setHasLabel: (hasLabel: boolean) => void;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (hasDescription: boolean) => void;
  errorId: string;
  /** Set while a FieldError is showing, which is only while the Field is invalid. */
  hasError: boolean;
  setHasError: (hasError: boolean) => void;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Returns the enclosing Field's state, or null outside one: every control also works on its own. */
export function useField() {
  return useContext(FieldContext);
}

/** Tells the enclosing Field, if any, that a part is rendered, for as long as `present` is true. */
export function useFieldPart(setPresent: ((present: boolean) => void) | undefined, present = true) {
  useLayoutEffect(() => {
    if (!setPresent || !present) return;
    setPresent(true);
    return () => setPresent(false);
  }, [setPresent, present]);
}

interface FieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

/**
 * The id and ARIA props a control takes from its Field: the Field's id (or its own, which the
 * label then follows), the description and error ids added to its own `aria-describedby`, and
 * `aria-invalid` while the Field is invalid. A control's own props win. Spread the result after
 * the control's props. Outside a Field it returns the props unchanged.
 */
export function useFieldControlProps(props: FieldControlProps): FieldControlProps {
  const field = useField();
  const setControlId = field?.setControlId;
  useLayoutEffect(() => {
    if (!setControlId || props.id === undefined) return;
    setControlId(props.id);
    return () => setControlId(undefined);
  }, [setControlId, props.id]);

  if (!field) return { id: props.id, "aria-describedby": props["aria-describedby"], "aria-invalid": props["aria-invalid"] };
  const describedBy = [
    props["aria-describedby"],
    field.hasDescription ? field.descriptionId : undefined,
    field.hasError ? field.errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    id: props.id ?? field.controlId,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
  };
}
