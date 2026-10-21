import type { ComponentPropsWithRef } from "react";
import type { SelectContentVariantProps } from "./SelectContent.variants";

export interface SelectContentProps extends ComponentPropsWithRef<"div">, SelectContentVariantProps {}
