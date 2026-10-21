import type { ButtonProps } from "../../Button/Button.types";

/** Takes every Button prop except `endIcon`, which holds the open/closed chevron. */
export interface DropdownMenuTriggerProps extends Omit<ButtonProps, "endIcon" | "iconAnimation"> {}
