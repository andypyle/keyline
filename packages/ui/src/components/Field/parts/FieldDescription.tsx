import { cn } from "@/lib/cn";
import { useField, useFieldPart } from "@/lib/field-context";
import type { FieldDescriptionProps } from "./FieldDescription.types";

/**
 * Help text for a Field's control. The control is described by it, so screen readers read it after
 * the label. It stays at full contrast in a disabled Field, where it's often what explains why.
 */
export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  const field = useField();
  useFieldPart(field?.setHasDescription);

  return (
    <p
      data-slot="field-description"
      id={field?.descriptionId}
      className={cn(["kl:m-0", "kl:font-body", "kl:text-sm", "kl:leading-snug", "kl:text-fg-2"], className)}
      {...props}
    />
  );
}
