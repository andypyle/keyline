import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import type { ToastVariantProps } from "@/components/Toast/Toast.variants";
import type { ToasterVariantProps } from "./Toaster.variants";

/** Takes every `<section>` prop, for the region the toasts appear in. `children` is your app, which renders outside that region. */
export interface ToasterProps extends Omit<ComponentPropsWithRef<"section">, "popover">, ToasterVariantProps {
  /** How long each toast stays, in milliseconds, unless `toast()` sets its own. `Infinity` keeps them until dismissed. */
  duration?: number;
  /** Most toasts shown at once. Showing another closes the oldest. */
  limit?: number;
  /** Accessible name of the region holding the toasts. Translate it along with the rest of your app. */
  label?: string;
  /** Accessible name of each toast's close button. */
  closeLabel?: string;
  /** Key that moves focus to the toasts, so keyboard users can reach their actions. `null` turns it off. */
  hotkey?: string | null;
}

/** What `toast()` takes. */
export interface ToastOptions {
  /** Says what happened. Make it carry the meaning: the tone's icon is hidden from assistive tech. */
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastVariantProps["tone"];
  /** One action, like Undo, shown as a ToastAction. Clicking it closes the toast. */
  action?: {
    label: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  /** Milliseconds this toast stays. Defaults to the Toaster's `duration`. */
  duration?: number;
}
