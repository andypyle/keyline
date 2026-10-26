import { usePopover } from "@/lib/popover-context";
import { Button } from "@/components/Button/Button";
import type { PopoverCloseProps } from "./PopoverClose.types";

/**
 * Button that closes a Popover and returns focus to its trigger, for actions like Cancel or Done.
 * It is a Button, `secondary` by default since closing is rarely the main action. Call
 * `event.preventDefault()` in `onClick` to keep the popover open.
 */
export function PopoverClose({ variant = "secondary", onClick, ...props }: PopoverCloseProps) {
  const popover = usePopover();

  return (
    <Button
      data-slot="popover-close"
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        popover.setOpen(false);
      }}
      {...props}
    />
  );
}
