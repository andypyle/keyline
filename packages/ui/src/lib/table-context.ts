import { createContext, useContext } from "react";

/** Which row group of a Table a cell is in: TableHeader, TableBody or TableFooter. */
export type TableSection = "header" | "body" | "footer";

export const TableSectionContext = createContext<TableSection | null>(null);

/** Returns the row group the enclosing TableHeader, TableBody or TableFooter provides, or null outside one. */
export function useTableSection() {
  return useContext(TableSectionContext);
}
