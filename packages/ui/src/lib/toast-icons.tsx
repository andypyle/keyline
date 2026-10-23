import type { ReactNode } from "react";
import type { ToastVariantProps } from "@/components/Toast/Toast.variants";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/**
 * The icon each Toast tone shows by default. Neutral has none. Hidden from assistive tech, so a
 * toast's title has to carry its meaning.
 */
export const toastToneIcons: Record<NonNullable<ToastVariantProps["tone"]>, ReactNode> = {
  neutral: null,
  success: <Icon d="M6 12.5l4 4 8-9" />,
  warning: <Icon d="M12 6v7M12 18h.01" />,
  danger: <Icon d="M7 7l10 10M17 7L7 17" />,
  info: <Icon d="M12 11v7M12 6h.01" />,
};

/** The X on a Toast's close button. */
export function ToastCloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
