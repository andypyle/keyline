import { cva, type VariantProps } from "class-variance-authority";

// Layered over tableCellVariants, which a TableHead shares with TableCell.
export const tableHeadVariants = cva(["kl:font-bold", "kl:whitespace-nowrap"]);

export type TableHeadVariantProps = VariantProps<typeof tableHeadVariants>;
