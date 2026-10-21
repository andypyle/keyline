import type { ComponentPropsWithRef } from "react";
import type { TextareaVariantProps } from "./Textarea.variants";

export interface TextareaProps extends ComponentPropsWithRef<"textarea">, TextareaVariantProps {}
