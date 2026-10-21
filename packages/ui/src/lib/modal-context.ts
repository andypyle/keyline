import { createContext, useContext, type RefObject } from "react";

/** What a Modal shares with its trigger, content and the parts inside it. */
export interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  contentRef: RefObject<HTMLDialogElement | null>;
  /** Whether a ModalTitle is rendered, so the dialog only points `aria-labelledby` at one that exists. */
  hasTitle: boolean;
  setHasTitle: (has: boolean) => void;
  /** Whether a ModalDescription is rendered, so the dialog only points `aria-describedby` at one that exists. */
  hasDescription: boolean;
  setHasDescription: (has: boolean) => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

/** Returns the enclosing Modal's state. Throws outside one, since the parts can't work alone. */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal parts must be rendered inside a Modal.");
  return context;
}
