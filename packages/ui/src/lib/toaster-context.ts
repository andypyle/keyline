import { createContext, useContext } from "react";
import type { ToastOptions } from "@/components/Toaster/Toaster.types";

/** What a Toaster gives the components inside it, through useToast. */
export interface ToasterContextValue {
  /** Shows a toast and returns its id. A string is shorthand for `{ title }`. */
  toast: (options: ToastOptions | string) => string;
  /** Closes the toast with this id, or every toast without one. */
  dismiss: (id?: string) => void;
}

export const ToasterContext = createContext<ToasterContextValue | null>(null);

/**
 * Returns `toast()` and `dismiss()` for the enclosing Toaster. Throws outside one, since there'd be
 * nowhere to show the toasts.
 */
export function useToast() {
  const context = useContext(ToasterContext);
  if (!context) throw new Error("useToast must be called inside a Toaster.");
  return context;
}
