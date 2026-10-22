import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Switch } from "./Switch";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 14, justifyItems: "start" } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <label style={option}>
      <Switch {...args} />
      Dark mode
    </label>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, step }) => {
    const toggle = canvas.getByRole("switch", { name: "Dark mode" });

    await step("is a switch, named by its label, starting off", async () => {
      await expect(toggle).not.toBeChecked();
    });

    await step("turns on and off on click and with Space", async () => {
      await userEvent.click(toggle);
      await expect(toggle).toBeChecked();
      await expect(toggle).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(toggle).not.toBeChecked();
      await expect(args.onChange).toHaveBeenCalledTimes(2);
    });

    await step("turns on when its label is clicked", async () => {
      await userEvent.click(canvas.getByText("Dark mode"));
      await expect(toggle).toBeChecked();
    });
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size} style={option}>
          <Switch {...args} size={size} defaultChecked />
          {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
        </label>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas, step }) => {
    const toggle = canvas.getByRole("switch", { name: "Dark mode" });

    await step("ignores clicks, on the switch and its label", async () => {
      await userEvent.click(toggle);
      await userEvent.click(canvas.getByText("Dark mode"));
      await expect(toggle).not.toBeChecked();
      await expect(args.onChange).not.toHaveBeenCalled();
    });

    await step("is skipped by keyboard navigation", async () => {
      await userEvent.tab();
      await expect(toggle).not.toHaveFocus();
    });
  },
};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <label style={option}>
        <Switch {...args} />
        Off
      </label>
      <label style={option}>
        <Switch {...args} defaultChecked />
        On
      </label>
      <label style={option}>
        <Switch {...args} aria-invalid />
        Invalid
      </label>
      <label style={option}>
        <Switch {...args} disabled />
        Disabled
      </label>
      <label style={option}>
        <Switch {...args} disabled defaultChecked />
        Disabled, on
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
