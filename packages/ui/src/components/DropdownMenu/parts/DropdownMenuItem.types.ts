import type { ComponentPropsWithRef } from "react";
import type { DropdownMenuItemVariantProps } from "./DropdownMenuItem.variants";

export interface DropdownMenuItemProps extends ComponentPropsWithRef<"button">, DropdownMenuItemVariantProps {}
