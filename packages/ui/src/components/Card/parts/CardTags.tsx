import { cn } from "../../../lib/cn";
import type { CardTagsProps } from "./CardTags.types";

/** List of CardTags. */
export function CardTags({ className, ...props }: CardTagsProps) {
  return (
    <ul
      data-slot="card-tags"
      className={cn(["kl:flex", "kl:flex-wrap", "kl:gap-2", "kl:m-0", "kl:p-0", "kl:list-none"], className)}
      {...props}
    />
  );
}
