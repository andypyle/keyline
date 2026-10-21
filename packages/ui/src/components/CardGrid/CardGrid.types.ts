import type { ComponentPropsWithRef } from "react";
import type { CardGridVariantProps } from "./CardGrid.variants";

export interface CardGridProps extends ComponentPropsWithRef<"div">, CardGridVariantProps {}
