import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Pagination } from "./Pagination";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const column = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 } as const;

/** The page numbers shown, in order, read from their accessible names. */
function shownPages(nav: HTMLElement) {
  return within(nav)
    .getAllByRole("button", { name: /^Page / })
    .map((button) => Number(button.textContent));
}

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=189-19" },
  },
  args: { pageCount: 10, onPageChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["full", "sm", "md", "lg", "xl"] },
    siblingCount: { control: { type: "number", min: 0 } },
    boundaryCount: { control: { type: "number", min: 0 } },
    getHref: { control: false },
    getPageLabel: { control: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    const previous = canvas.getByRole("button", { name: "Previous" });
    const next = canvas.getByRole("button", { name: "Next" });

    await step("starts on page 1, with Previous disabled", async () => {
      await expect(canvas.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
      await expect(previous).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(previous);
      await expect(args.onPageChange).not.toHaveBeenCalled();
    });

    await step("buttons default to type=button, so they never submit a surrounding form", async () => {
      for (const button of within(nav).getAllByRole("button")) await expect(button).toHaveAttribute("type", "button");
    });

    await step("clicking a page makes it current and calls onPageChange", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Page 3" }));
      await expect(args.onPageChange).toHaveBeenLastCalledWith(3, expect.anything());
      await expect(canvas.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
      await expect(canvas.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("aria-current");
    });

    await step("clicking the current page does nothing", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Page 3" }));
      await expect(args.onPageChange).toHaveBeenCalledTimes(1);
    });

    await step("Previous and Next step one page", async () => {
      await userEvent.click(next);
      await expect(args.onPageChange).toHaveBeenLastCalledWith(4, expect.anything());
      await userEvent.click(previous);
      await userEvent.click(previous);
      await expect(args.onPageChange).toHaveBeenLastCalledWith(2, expect.anything());
    });

    await step("a clicked page keeps focus as it becomes current", async () => {
      const page5 = canvas.getByRole("button", { name: "Page 5" });
      await userEvent.click(page5);
      await expect(canvas.getByRole("button", { name: "Page 5" })).toHaveFocus();
    });

    await step("works from the keyboard", async () => {
      next.focus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(canvas.getByRole("button", { name: "Page 7" })).toHaveAttribute("aria-current", "page");
      // Don't leave a focus ring on the story after the test.
      next.blur();
    });
  },
};

/**
 * Long ranges collapse into ellipses, keeping the same number of controls wherever the current page
 * is, so they don't shift under the pointer as you move through them.
 */
export const ManyPages: Story = {
  args: { pageCount: 50, defaultPage: 25 },
  play: async ({ canvas, step }) => {
    const nav = canvas.getByRole("navigation");

    await step("shows the first and last pages, and the current page's siblings", async () => {
      await expect(shownPages(nav)).toEqual([1, 24, 25, 26, 50]);
    });

    await step("near the start, the far ellipsis's places go to the near end", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Page 1" }));
      await expect(shownPages(nav)).toEqual([1, 2, 3, 4, 5, 50]);
      await userEvent.click(canvas.getByRole("button", { name: "Page 4" }));
      await expect(shownPages(nav)).toEqual([1, 2, 3, 4, 5, 50]);
      await userEvent.click(canvas.getByRole("button", { name: "Page 5" }));
      await expect(shownPages(nav)).toEqual([1, 4, 5, 6, 50]);
    });

    await step("hides the ellipses from assistive tech", async () => {
      // Two ellipses on page 5 of 50; neither is in the accessibility tree.
      const ellipses = [...nav.querySelectorAll("li")].filter((li) => li.textContent === "…");
      await expect(ellipses).toHaveLength(2);
      for (const ellipsis of ellipses) await expect(ellipsis).toHaveAttribute("aria-hidden", "true");
      canvas.getByRole("button", { name: "Page 5" }).blur();
    });
  },
};

/** With few enough pages, every page shows and there's no ellipsis. */
export const FewPages: Story = {
  args: { pageCount: 4, defaultPage: 2 },
  play: async ({ canvas }) => {
    await expect(shownPages(canvas.getByRole("navigation"))).toEqual([1, 2, 3, 4]);
  },
};

/** `siblingCount` and `boundaryCount` widen the range around the current page and at each end. */
export const SiblingsAndBoundaries: Story = {
  args: { pageCount: 50, defaultPage: 25 },
  render: (args) => (
    <div style={column}>
      <Pagination {...args} aria-label="No siblings" siblingCount={0} />
      <Pagination {...args} aria-label="Default" />
      <Pagination {...args} aria-label="Two siblings, two boundary pages" siblingCount={2} boundaryCount={2} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(shownPages(canvas.getByRole("navigation", { name: "No siblings" }))).toEqual([1, 25, 50]);
    await expect(shownPages(canvas.getByRole("navigation", { name: "Two siblings, two boundary pages" }))).toEqual([
      1, 2, 23, 24, 25, 26, 27, 49, 50,
    ]);
  },
};

/** On the last page, Next is disabled but keeps focus, so the reader isn't dropped back to the top of the page. */
export const LastPage: Story = {
  args: { defaultPage: 9 },
  play: async ({ args, canvas }) => {
    const next = canvas.getByRole("button", { name: "Next" });
    await userEvent.click(next);
    await expect(args.onPageChange).toHaveBeenLastCalledWith(10, expect.anything());
    await expect(next).toHaveAttribute("aria-disabled", "true");
    await expect(next).toHaveFocus();
    await userEvent.click(next);
    await expect(args.onPageChange).toHaveBeenCalledTimes(1);
    next.blur();
  },
};

/** Control the page with `page` and `onPageChange`, to keep it in step with what's shown. */
export const Controlled: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    return (
      <div style={column}>
        <p style={{ margin: 0 }} aria-live="polite">
          Showing results {(page - 1) * 20 + 1}–{page * 20} of {args.pageCount * 20}
        </p>
        <Pagination
          {...args}
          aria-label="Results pages"
          page={page}
          onPageChange={(next, event) => {
            setPage(next);
            args.onPageChange?.(next, event);
          }}
        />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Page 2" }));
    await expect(canvas.getByText("Showing results 21–40 of 200")).toBeInTheDocument();
    canvas.getByRole("button", { name: "Page 2" }).blur();
  },
};

/**
 * With `getHref`, every page is a link, for paging through URLs. At either end, Previous or Next
 * loses its `href`. `onPageChange` still fires; call `event.preventDefault()` in it to route on the
 * client instead.
 */
export const Links: Story = {
  args: { pageCount: 20, defaultPage: 1, getHref: (page) => `?page=${page}` },
  play: async ({ canvas, step }) => {
    await step("renders links, with the current page marked", async () => {
      await expect(canvas.queryAllByRole("button")).toHaveLength(0);
      await expect(canvas.getByRole("link", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
      await expect(canvas.getByRole("link", { name: "Page 2" })).toHaveAttribute("href", "?page=2");
      await expect(canvas.getByRole("link", { name: "Next" })).toHaveAttribute("href", "?page=2");
    });

    await step("a disabled Previous has no href, but is still announced as a disabled link", async () => {
      const previous = canvas.getByRole("link", { name: "Previous" });
      await expect(previous).not.toHaveAttribute("href");
      await expect(previous).toHaveAttribute("aria-disabled", "true");
    });
  },
};

/** `getPageLabel`, `previousLabel` and `nextLabel` translate the controls. Keep the number in each page's label. */
export const CustomLabels: Story = {
  args: {
    "aria-label": "Seiten",
    pageCount: 5,
    defaultPage: 2,
    getPageLabel: (page) => `Seite ${page}`,
    previousLabel: "Zurück",
    nextLabel: "Weiter",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Seiten" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Seite 2" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: "Zurück" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Weiter" })).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  args: { pageCount: 20, defaultPage: 10 },
  render: (args) => (
    <div style={column}>
      <Pagination {...args} aria-label="Small" size="sm" />
      <Pagination {...args} aria-label="Medium" size="md" />
      <Pagination {...args} aria-label="Large" size="lg" />
    </div>
  ),
};

export const Radius: Story = {
  args: { pageCount: 20, defaultPage: 10 },
  render: (args) => (
    <div style={column}>
      <Pagination {...args} aria-label="Full" radius="full" />
      <Pagination {...args} aria-label="Large" radius="lg" />
      <Pagination {...args} aria-label="Small" radius="sm" />
    </div>
  ),
};

/**
 * On phones (below 721px), Previous and Next shrink to their icons, though their labels are still
 * read out, and every size takes sm's dimensions. With `siblingCount={0}`, the row fits a 320px screen.
 */
export const Mobile: Story = {
  args: { pageCount: 20, defaultPage: 10, siblingCount: 0 },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Next" })).toBeInTheDocument();
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const Dark: Story = {
  name: "Default (dark)",
  args: { pageCount: 20, defaultPage: 10 },
  globals: { theme: "dark" },
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
