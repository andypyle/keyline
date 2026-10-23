import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Input } from "./Input";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 20, maxWidth: 360 } as const;
const field = { display: "grid", gap: 6, fontWeight: 600 } as const;
const hint = { fontSize: 14, fontWeight: 400 } as const;

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/gVJvJJAOtJkcdeBHk61Ivb/Keyline?node-id=2-177" },
  },
  args: { onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["full", "sm", "md", "lg", "xl"] },
    type: { control: "select", options: ["text", "email", "password", "search", "url", "tel", "number"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  render: (args) => (
    <label style={{ ...field, maxWidth: 360 }}>
      Name
      <Input {...args} />
    </label>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Ada Lovelace" },
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Name" });

    await step("defaults to type=text", async () => {
      await expect(input).toHaveAttribute("type", "text");
    });

    await step("is focusable and takes typing", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
      await userEvent.keyboard("Ada");
      await expect(input).toHaveValue("Ada");
      await expect(args.onChange).toHaveBeenCalledTimes(3);
    });
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={field}>
        Small
        <Input {...args} size="sm" placeholder="Small" />
      </label>
      <label style={field}>
        Medium
        <Input {...args} size="md" placeholder="Medium" />
      </label>
      <label style={field}>
        Large
        <Input {...args} size="lg" placeholder="Large" />
      </label>
    </div>
  ),
};

export const Radius: Story = {
  render: (args) => (
    <div style={stack}>
      {(["full", "xl", "lg", "md", "sm"] as const).map((radius) => (
        <label key={radius} style={field}>
          {radius.toUpperCase()}
          <Input {...args} radius={radius} />
        </label>
      ))}
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={field}>
        Email
        <Input {...args} type="email" placeholder="ada@example.com" autoComplete="email" />
      </label>
      <label style={field}>
        Password
        <Input {...args} type="password" autoComplete="current-password" />
      </label>
      <label style={field}>
        Search
        <Input {...args} type="search" placeholder="Search…" />
      </label>
      <label style={field}>
        Quantity
        <Input {...args} type="number" defaultValue={1} min={1} />
      </label>
    </div>
  ),
};

/** Pair `aria-invalid` with `aria-describedby` pointing at the message, so the error is announced with the field. */
export const Invalid: Story = {
  render: (args) => (
    <div style={{ ...field, maxWidth: 360 }}>
      <label htmlFor="invalid-email">Email</label>
      <Input {...args} id="invalid-email" type="email" defaultValue="ada@" aria-invalid aria-describedby="invalid-email-error" />
      <span id="invalid-email-error" style={hint}>
        Enter a full email address, like ada@example.com.
      </span>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Enter a full email address, like ada@example.com.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Ada Lovelace" },
  play: async ({ args, canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Name" });

    await step("ignores typing", async () => {
      await expect(input).toBeDisabled();
      await userEvent.type(input, "x");
      await expect(input).toHaveValue("Ada Lovelace");
      await expect(args.onChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(input).not.toHaveFocus();
    });
  },
};

/** Read-only fields stay focusable and their value can be selected and copied, unlike disabled ones. */
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "ada-lovelace" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Name" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard("x");
    await expect(input).toHaveValue("ada-lovelace");
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={field}>
        Empty
        <Input {...args} placeholder="Placeholder" />
      </label>
      <label style={field}>
        Filled
        <Input {...args} defaultValue="Ada Lovelace" />
      </label>
      <label style={field}>
        Invalid
        <Input {...args} defaultValue="ada@" aria-invalid />
      </label>
      <label style={field}>
        Read-only
        <Input {...args} defaultValue="ada-lovelace" readOnly />
      </label>
      <label style={field}>
        Disabled
        <Input {...args} defaultValue="Ada Lovelace" disabled />
      </label>
    </div>
  ),
};

/** Dark mode swaps the semantic tokens, so contrast is checked here too. */
export const StatesDark: Story = {
  name: "States (dark)",
  globals: { theme: "dark" },
  render: States.render,
  play: async () => {
    // Guards the contrast check: if the theme global stops applying, this story would silently test light mode.
    await expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  },
};
