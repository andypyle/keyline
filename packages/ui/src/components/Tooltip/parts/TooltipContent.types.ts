import type { ComponentPropsWithRef } from "react";
import type { TooltipContentVariantProps } from "./TooltipContent.variants";

export interface TooltipContentProps extends ComponentPropsWithRef<"span">, TooltipContentVariantProps {}
