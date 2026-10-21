import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Radio } from "./Radio";

// Stories are excluded from Tailwind's source scan, so layout here uses inline styles.
const stack = { display: "grid", gap: 14, justifyItems: "start" } as const;
const option = { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 500 } as const;

/** Radios belong in a RadioGroup, which ties them together; see RadioGroup for its keyboard and form behaviour. */
const meta = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: { value: "standard", onChange: fn() },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <RadioGroup aria-label="Shipping" style={stack}>
      <label style={option}>
        <Radio {...args} value="standard" />
        Standard
      </label>
      <label style={option}>
        <Radio {...args} value="express" />
        Express
      </label>
    </RadioGroup>
  ),
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const standard = canvas.getByRole("radio", { name: "Standard" });
    const express = canvas.getByRole("radio", { name: "Express" });
    await userEvent.click(express);
    await expect(express).toBeChecked();
    await userEvent.click(canvas.getByText("Standard"));
    await expect(standard).toBeChecked();
    await expect(express).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <RadioGroup aria-label="Size" defaultValue="md" style={stack}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size} style={option}>
          <Radio {...args} value={size} size={size} />
          {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
        </label>
      ))}
    </RadioGroup>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <RadioGroup aria-label="Enabled" defaultValue="checked" style={stack}>
        <label style={option}>
          <Radio {...args} value="unchecked" />
          Unchecked
        </label>
        <label style={option}>
          <Radio {...args} value="checked" />
          Checked
        </label>
        <label style={option}>
          <Radio {...args} value="invalid" aria-invalid />
          Invalid
        </label>
      </RadioGroup>
      <RadioGroup aria-label="Disabled" defaultValue="disabled-checked" disabled style={stack}>
        <label style={option}>
          <Radio {...args} value="disabled" />
          Disabled
        </label>
        <label style={option}>
          <Radio {...args} value="disabled-checked" />
          Disabled, checked
        </label>
      </RadioGroup>
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
