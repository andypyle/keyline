import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Button } from "../Button/Button";
import { ButtonGroup } from "./ButtonGroup";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const row = { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 } as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: {
    "aria-label": "Date range",
    variant: "secondary",
    children: (
      <>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </>
    ),
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["full", "sm", "md", "lg", "xl"] },
    variant: { control: "inline-radio", options: ["primary", "secondary", "neutral", "inverse", "danger", "ghost"] },
    children: { control: false },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, step }) => {
    await step("is exposed as a named group", async () => {
      await expect(canvas.getByRole("group", { name: "Date range" })).toBeInTheDocument();
    });

    await step("tabs through its buttons in order", async () => {
      for (const name of ["Day", "Week", "Month"]) {
        await userEvent.tab();
        await expect(canvas.getByRole("button", { name })).toHaveFocus();
      }
      // Don't leave a focus ring on the story after the test.
      canvas.getByRole("button", { name: "Month" }).blur();
    });
  },
};

/** Stacked groups default to the `lg` radius; pills read badly when stacked. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={{ width: 220 }}>
      <ButtonGroup {...args} style={{ display: "flex" }} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...row, flexDirection: "column" }}>
      <ButtonGroup {...args} size="sm" />
      <ButtonGroup {...args} size="md" />
      <ButtonGroup {...args} size="lg" />
    </div>
  ),
};

export const Radius: Story = {
  render: (args) => (
    <div style={{ ...row, flexDirection: "column" }}>
      <ButtonGroup {...args} radius="full" />
      <ButtonGroup {...args} radius="lg" />
      <ButtonGroup {...args} radius="sm" />
    </div>
  ),
};

/** A Button's own props override the group's defaults. */
export const MixedVariants: Story = {
  args: {
    "aria-label": "Draft actions",
    variant: "secondary",
    children: (
      <>
        <Button>Save draft</Button>
        <Button>Preview</Button>
        <Button variant="primary">Publish</Button>
      </>
    ),
  },
};

/** Ghost groups drop the shadow along with the borders: a quiet toolbar. */
export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const IconOnly: Story = {
  args: {
    "aria-label": "Text formatting",
    size: "icon",
    children: (
      <>
        <Button aria-label="Bold" startIcon={<Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />} />
        <Button aria-label="Italic" startIcon={<Icon d="M14 5h-4M14 19h-4M14 5l-4 14" />} />
        <Button aria-label="Underline" startIcon={<Icon d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />} />
      </>
    ),
  },
};

/** Buttons keep their own icons and icon animations inside a group. Hover Previous and Next. */
export const WithIcons: Story = {
  args: {
    "aria-label": "Pagination",
    children: (
      <>
        <Button startIcon={<Icon d="M19 12H5M11 6l-6 6 6 6" />} iconAnimation="dash">
          Previous
        </Button>
        <Button>Page 2 of 9</Button>
        <Button endIcon={<Icon d="M5 12h14M13 6l6 6-6 6" />} iconAnimation="dash">
          Next
        </Button>
      </>
    ),
  },
};

export const WithDisabled: Story = {
  args: {
    children: (
      <>
        <Button>Day</Button>
        <Button disabled>Week</Button>
        <Button>Month</Button>
      </>
    ),
  },
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const Dark: Story = {
  name: "Default (dark)",
  globals: { theme: "dark" },
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
