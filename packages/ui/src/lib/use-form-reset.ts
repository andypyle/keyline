import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `onReset` when the form an element belongs to is reset, for controls that keep their value
 * in React state, which a native reset can't reach. The form is the one `formId` names, as with a
 * native `form` attribute, or else the element's closest. `onReset` runs from the form's `reset`
 * event, before the browser resets the native controls; state set there renders after them.
 */
export function useFormReset(elementRef: RefObject<HTMLElement | null>, formId: string | undefined, onReset: () => void) {
  const onResetRef = useRef(onReset);
  useEffect(() => {
    onResetRef.current = onReset;
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const form = formId ? element.ownerDocument.getElementById(formId) : element.closest("form");
    if (!(form instanceof HTMLFormElement)) return;
    const handle = () => onResetRef.current();
    form.addEventListener("reset", handle);
    return () => form.removeEventListener("reset", handle);
  }, [elementRef, formId]);
}
