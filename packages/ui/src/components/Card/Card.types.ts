import type { ComponentPropsWithRef } from "react";
import type { CardVariantProps } from "./Card.variants";

export interface CardProps extends ComponentPropsWithRef<"div">, CardVariantProps {}
