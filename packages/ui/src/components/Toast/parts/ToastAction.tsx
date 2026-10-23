import { cn } from "@/lib/cn";
import { useToastPart } from "@/lib/toast-context";
import { Button } from "@/components/Button/Button";
import type { ToastActionProps } from "./ToastAction.types";

/**
 * Button for the one action a Toast offers, like Undo. It is a Button, small and `secondary` by
 * default, and closes the toast after its `onClick`; call `event.preventDefault()` to keep it open.
 *
 * The toast may close itself before someone reaches the action, so don't make it the only way to
 * do something.
 */
export function ToastAction({ className, variant = "secondary", size = "sm", onClick, ...props }: ToastActionProps) {
  const toast = useToastPart();

  return (
    <Button
      data-slot="toast-action"
      variant={variant}
      size={size}
      className={cn(["kl:self-start", "kl:mt-2"], className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toast.close();
      }}
      {...props}
    />
  );
}
