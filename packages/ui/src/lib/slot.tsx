import { cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
import { cn } from "./cn";
import { mergeRefs } from "./merge-refs";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  /** The one element that takes the props. */
  children?: ReactNode;
}

type ChildProps = Record<string, unknown> & { className?: string; style?: object; ref?: Ref<HTMLElement> };

/**
 * Renders its only child with the Slot's props merged in, for parts that take `asChild`: the
 * consumer's element replaces the part's own while keeping its behavior. The child's props win,
 * except that classes and styles combine, both event handlers run (the child's first, so it can
 * call `preventDefault()` to stop the part's), and both refs are set.
 */
export function Slot({ children, ref, ...props }: SlotProps) {
  if (!isValidElement(children)) throw new Error("A part with asChild needs exactly one element as its child.");
  const child = children as ReactElement<ChildProps>;
  const childProps = child.props;
  const merged: ChildProps = { ...props, ...childProps };

  for (const [name, handler] of Object.entries(props)) {
    const childHandler = childProps[name];
    if (!/^on[A-Z]/.test(name) || typeof handler !== "function" || typeof childHandler !== "function") continue;
    merged[name] = (...args: unknown[]) => {
      childHandler(...args);
      handler(...args);
    };
  }
  merged.className = cn(props.className, childProps.className);
  merged.style = { ...props.style, ...childProps.style };
  merged.ref = mergeRefs(ref, childProps.ref);

  return cloneElement(child, merged);
}
