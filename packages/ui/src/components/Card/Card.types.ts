import type { ComponentPropsWithRef } from "react";
import type { CardLayoutVariantProps, CardVariantProps } from "./Card.variants";

export interface CardProps extends ComponentPropsWithRef<"div">, CardVariantProps, CardLayoutVariantProps {}
