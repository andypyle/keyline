import { createContext, useContext } from "react";

/** What a Toast shares with the parts inside it. */
export interface ToastContextValue {
  /** Closes the toast, as its close button does. */
  close: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/** Returns the enclosing Toast's state. Throws outside one, since the parts can't work alone. */
export function useToastPart() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Toast parts must be rendered inside a Toast.");
  return context;
}
