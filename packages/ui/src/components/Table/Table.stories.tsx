import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Table } from "./Table";
import type { TableProps } from "./Table.types";
import { TableBody } from "./parts/TableBody";
import { TableCaption } from "./parts/TableCaption";
import { TableCell } from "./parts/TableCell";
import { TableFooter } from "./parts/TableFooter";
import { TableHead } from "./parts/TableHead";
import { TableHeader } from "./parts/TableHeader";
import { TableRow } from "./parts/TableRow";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const column = { display: "flex", flexDirection: "column", gap: 32 } as const;

const budget = [
  { category: "Rent", budgeted: 1450, spent: 1450 },
  { category: "Groceries", budgeted: 600, spent: 542.18 },
  { category: "Utilities", budgeted: 220, spent: 231.4 },
  { category: "Transit", budgeted: 140, spent: 96.5 },
  { category: "Eating out", budgeted: 180, spent: 164.75 },
  { category: "Health", budgeted: 120, spent: 45 },
  { category: "Gifts", budgeted: 60, spent: 82.3 },
];

/** Waits a frame, so a scroll has been laid out before reading positions. */
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** The inner edges of a scroll container, inside its border. */
function innerEdges(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  return { top: rect.top + container.clientTop, left: rect.left + container.clientLeft };
}

const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const total = (key: "budgeted" | "spent") => budget.reduce((sum, row) => sum + row[key], 0);

// Called as a function, not rendered as <BudgetTable>, so the story returns the Table itself and the
// docs' "Show code" snippet shows how it's composed rather than a helper component.
function budgetTable(props: TableProps) {
  return (
    <Table {...props}>
      <TableCaption>Household budget for March. Amounts in US dollars.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead align="end">Budgeted</TableHead>
          <TableHead align="end">Spent</TableHead>
          <TableHead align="end">Remaining</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budget.map((row) => (
          <TableRow key={row.category}>
            <TableHead>{row.category}</TableHead>
            <TableCell align="end">{money(row.budgeted)}</TableCell>
            <TableCell align="end">{money(row.spent)}</TableCell>
            <TableCell align="end">{money(row.budgeted - row.spent)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead>Total</TableHead>
          <TableCell align="end">{money(total("budgeted"))}</TableCell>
          <TableCell align="end">{money(total("spent"))}</TableCell>
          <TableCell align="end">{money(total("budgeted") - total("spent"))}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

const transactions = [
  { date: "Mar 1", payee: "Harbor Lane Apartments", category: "Rent", amount: 1450 },
  { date: "Mar 2", payee: "Fieldstone Market", category: "Groceries", amount: 86.42 },
  { date: "Mar 4", payee: "City Transit", category: "Transit", amount: 48.25 },
  { date: "Mar 7", payee: "Bay Power & Light", category: "Utilities", amount: 131.4 },
  { date: "Mar 9", payee: "Fieldstone Market", category: "Groceries", amount: 112.9 },
  { date: "Mar 12", payee: "Noodle Bar", category: "Eating out", amount: 38.6 },
  { date: "Mar 15", payee: "Riverside Pharmacy", category: "Health", amount: 45 },
  { date: "Mar 18", payee: "Fieldstone Market", category: "Groceries", amount: 97.33 },
  { date: "Mar 21", payee: "Tidewater Water Co.", category: "Utilities", amount: 100 },
  { date: "Mar 24", payee: "Paper & Thread", category: "Gifts", amount: 82.3 },
];

// A table labelled only by its column headers: every body cell is a TableCell, none a row header.
function transactionsTable(props: TableProps) {
  return (
    <Table {...props}>
      <TableCaption>Transactions in March.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Payee</TableHead>
          <TableHead>Category</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((row) => (
          <TableRow key={`${row.date} ${row.payee}`}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.payee}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell align="end">{money(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: "Display/Table",
  component: Table,
  tags: ["autodocs"],
  // The component's page in the Figma file, for the toolbar's Figma link. Empty hides the link.
  parameters: {
    design: { type: "figma", url: "" },
  },
  args: { flat: false, noRowBorders: false, stickyHeader: false, stickyColumn: false },
  render: (args) => budgetTable(args),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    const table = canvas.getByRole("table");

    await step("takes its accessible name from the caption", async () => {
      await expect(table).toHaveAccessibleName("Household budget for March. Amounts in US dollars.");
    });

    await step("scopes TableHeads to columns in the header and to rows elsewhere", async () => {
      const columns = canvas.getAllByRole("columnheader");
      await expect(columns.map((cell) => cell.textContent)).toEqual(["Category", "Budgeted", "Spent", "Remaining"]);
      for (const cell of columns) await expect(cell).toHaveAttribute("scope", "col");

      const rows = canvas.getAllByRole("rowheader");
      await expect(rows.map((cell) => cell.textContent)).toEqual([
        ...budget.map((row) => row.category),
        "Total",
      ]);
      for (const cell of rows) await expect(cell).toHaveAttribute("scope", "row");
    });

    await step("isn't a tab stop while it fits its container", async () => {
      const container = canvasElement.querySelector("[data-slot=table-container]")!;
      await expect(container).not.toHaveAttribute("tabindex");
      await userEvent.tab();
      await expect(document.body).toHaveFocus();
    });
  },
};

/** `flat` keeps the outline but drops the shadow. */
export const Flat: Story = {
  args: { flat: true },
};

/** `noRowBorders` drops the rules between body rows, keeping the header's and footer's. */
export const NoRowBorders: Story = {
  args: { noRowBorders: true },
};

/** A table wider than its container scrolls sideways, and the container takes focus so keyboard users can scroll it. */
export const Scrolling: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      {budgetTable(args)}
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const container = canvasElement.querySelector<HTMLElement>("[data-slot=table-container]")!;

    await step("becomes a tab stop once it overflows", async () => {
      await waitFor(() => expect(container).toHaveAttribute("tabindex", "0"));
      await userEvent.tab();
      await expect(container).toHaveFocus();
    });

    await step("stops being one when it fits again", async () => {
      container.parentElement!.style.width = "800px";
      await waitFor(() => expect(container).not.toHaveAttribute("tabindex"));
      container.parentElement!.style.width = "280px";
      await waitFor(() => expect(container).toHaveAttribute("tabindex", "0"));
    });
  },
};

/**
 * `stickyColumn` keeps the first cell of each row in view while a narrow table scrolls sideways,
 * so every row stays labelled. It only takes effect while the table scrolls, so there's no
 * breakpoint to set: on a wide screen the table fits and looks the same as without it.
 */
export const StickyColumn: Story = {
  args: { stickyColumn: true },
  render: (args) => <div style={{ width: 320 }}>{budgetTable(args)}</div>,
  play: async ({ canvas, canvasElement, step }) => {
    const container = canvasElement.querySelector<HTMLElement>("[data-slot=table-container]")!;

    await step("keeps the row headers at the start edge while scrolled sideways", async () => {
      container.scrollLeft = container.scrollWidth;
      await nextFrame();
      await expect(container.scrollLeft).toBeGreaterThan(0);
      for (const name of ["Category", "Groceries", "Total"]) {
        const cell = canvas.getByRole(name === "Category" ? "columnheader" : "rowheader", { name });
        await expect(cell.getBoundingClientRect().left).toBeCloseTo(innerEdges(container).left, 0);
      }
    });

    await step("scrolls the other columns under them", async () => {
      const spent = canvas.getByRole("columnheader", { name: "Budgeted" });
      await expect(spent.getBoundingClientRect().left).toBeLessThan(innerEdges(container).left);
    });

    await step("keeps the caption within the visible part of the table", async () => {
      const caption = canvas.getByText("Household budget for March. Amounts in US dollars.");
      const { left } = innerEdges(container);
      await expect(caption.getBoundingClientRect().left).toBeGreaterThanOrEqual(left);
      await expect(caption.getBoundingClientRect().right).toBeLessThanOrEqual(left + container.clientWidth);
    });
  },
};

/** Without row headers, the column headers alone label the data, and every body cell is a TableCell. */
export const ColumnHeadersOnly: Story = {
  render: (args) => transactionsTable(args),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("table")).toHaveAccessibleName("Transactions in March.");
    await expect(canvas.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual([
      "Date",
      "Payee",
      "Category",
      "Amount",
    ]);
    await expect(canvas.queryAllByRole("rowheader")).toHaveLength(0);
  },
};

/**
 * With `maxHeight`, a taller table scrolls inside its container, and `stickyHeader` keeps the
 * column headers in view.
 *
 * The header sticks within the table's own container, not the page: the container scrolls
 * sideways, and a sticky element sticks to its nearest scrolling ancestor.
 */
export const StickyHeader: Story = {
  args: { stickyHeader: true, maxHeight: 280 },
  render: (args) => transactionsTable(args),
  play: async ({ canvas, canvasElement, step }) => {
    const container = canvasElement.querySelector<HTMLElement>("[data-slot=table-container]")!;

    await step("scrolls vertically, and takes focus so keyboard users can scroll it", async () => {
      await waitFor(() => expect(container).toHaveAttribute("tabindex", "0"));
      await userEvent.tab();
      await expect(container).toHaveFocus();
    });

    await step("keeps the header row at the top while scrolled down", async () => {
      container.scrollTop = container.scrollHeight;
      await nextFrame();
      await expect(container.scrollTop).toBeGreaterThan(0);
      const { top } = innerEdges(container);
      for (const header of canvas.getAllByRole("columnheader")) {
        await expect(header.getBoundingClientRect().top).toBeCloseTo(top, 0);
      }
      await expect(canvas.getByText("Harbor Lane Apartments").getBoundingClientRect().bottom).toBeLessThan(top);
    });

    await step("draws the header above the rows scrolling under it", async () => {
      const header = canvas.getByRole("columnheader", { name: "Payee" });
      const rect = header.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      await expect(header.contains(hit)).toBe(true);
    });
  },
};

/**
 * Together, `stickyHeader` and `stickyColumn` freeze both edges of a table that scrolls both ways,
 * and the corner header stays put.
 */
export const StickyHeaderAndColumn: Story = {
  args: { stickyHeader: true, stickyColumn: true, maxHeight: 240 },
  render: (args) => <div style={{ width: 320 }}>{budgetTable(args)}</div>,
  play: async ({ canvas, canvasElement, step }) => {
    const container = canvasElement.querySelector<HTMLElement>("[data-slot=table-container]")!;
    const corner = canvas.getByRole("columnheader", { name: "Category" });
    const spent = canvas.getByRole("columnheader", { name: "Spent" });

    await step("keeps the header row at the top while scrolled down", async () => {
      container.scrollTop = container.scrollHeight;
      await nextFrame();
      await expect(container.scrollTop).toBeGreaterThan(0);
      await expect(spent.getBoundingClientRect().top).toBeCloseTo(innerEdges(container).top, 0);
      await expect(canvas.getByRole("rowheader", { name: "Rent" }).getBoundingClientRect().top).toBeLessThan(
        innerEdges(container).top,
      );
    });

    await step("keeps the corner header in place both ways", async () => {
      container.scrollLeft = container.scrollWidth;
      await nextFrame();
      const { top, left } = innerEdges(container);
      await expect(corner.getBoundingClientRect().top).toBeCloseTo(top, 0);
      await expect(corner.getBoundingClientRect().left).toBeCloseTo(left, 0);
      // The corner sits above the cells scrolling under it, so it's what a pointer there hits.
      const hit = document.elementFromPoint(left + 4, top + 4);
      await expect(corner.contains(hit)).toBe(true);
    });
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={column}>
      {budgetTable(args)}
      {budgetTable({ ...args, flat: true })}
      {budgetTable({ ...args, noRowBorders: true })}
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const VariantsDark: Story = {
  name: "Variants (dark)",
  globals: { theme: "dark" },
  render: Variants.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
