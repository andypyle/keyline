import { createContext, useContext } from "react";
import type { CardLayoutVariantProps, CardVariantProps } from "@/components/Card/Card.variants";

/** What a CardGrid tells one Card inside it. The Card's own props take precedence. */
export interface CardGridItemContextValue {
  orientation?: CardVariantProps["orientation"];
  reversed?: CardLayoutVariantProps["reversed"];
}

export const CardGridItemContext = createContext<CardGridItemContextValue | null>(null);

/** Returns the layout the enclosing CardGrid gives this Card, or null outside one. */
export function useCardGridItem() {
  return useContext(CardGridItemContext);
}
